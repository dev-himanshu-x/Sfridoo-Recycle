import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';
import Listing from './models/Listing.js';
import DemandRequest from './models/DemandRequest.js';
import sgMail from '@sendgrid/mail';

dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:3000'];

// SendGrid setup
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'YOUR_SENDGRID_API_KEY_HERE') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser clients and the local Next.js app.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recycle_ai';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
const geminiModelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
const razorpayClient = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null;

const listingResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    material_type: { type: SchemaType.STRING },
    framing: { type: SchemaType.STRING },
    estimated_value_per_unit: { type: SchemaType.STRING },
    total_estimated_value: { type: SchemaType.STRING },
    sustainability_impact: {
      type: SchemaType.OBJECT,
      properties: {
        co2_saved_kg: { type: SchemaType.NUMBER },
        water_saved_liters: { type: SchemaType.NUMBER },
        trees_equivalent: { type: SchemaType.NUMBER },
      },
      required: ['co2_saved_kg', 'water_saved_liters', 'trees_equivalent'],
    },
      potential_buyers: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      isHazardous: { type: SchemaType.BOOLEAN },
    },
  required: [
    'title',
    'description',
    'category',
    'material_type',
    'framing',
    'estimated_value_per_unit',
    'total_estimated_value',
    'sustainability_impact',
    'potential_buyers',
    'isHazardous',
  ],
} as const;

function extractJsonObject(text: string) {
  const trimmed = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(`Gemini returned non-JSON content: ${trimmed.slice(0, 200)}`);
  }

  return JSON.parse(trimmed.slice(startIndex, endIndex + 1));
}

function parseInrValue(value: string | undefined | null) {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

async function uploadImageToCloudinary(file: Express.Multer.File) {
  try {
    const uploadPromise = new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'recycle_ai' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const result = await uploadPromise;
    return result?.secure_url || null;
  } catch (error) {
    console.warn('Cloudinary upload failed, continuing without hosted image:', error);
    return null;
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Intelligent Circular Economy OS Active' });
});

app.post('/api/listings/analyze-and-create', upload.single('image'), async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in the backend environment' });
    }

    const { quantity, province, unit, isHazardous: userIsHazardous } = req.body;
    if (!quantity || !province) {
      return res.status(400).json({ error: 'quantity and province are required' });
    }

    let imagePart = null;
    let uploadedImageUrl = null;

    if (req.file) {
      uploadedImageUrl = await uploadImageToCloudinary(req.file);

      imagePart = {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        },
      };
    }

    const model = genAI.getGenerativeModel({
      model: geminiModelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: listingResponseSchema as any,
      },
    });

    const prompt = `
      You are an AI assistant for a B2B circular economy platform.
      Analyze the industrial waste image and the listing details below.
      Quantity: ${quantity} ${unit || 'kg'}.
      Location: ${province}.

      User marked as hazardous: ${userIsHazardous === 'true' || userIsHazardous === true ? 'Yes' : 'No'}

      If the user has not marked this as hazardous, analyze the material type and determine if it is inherently hazardous. 
      Return isHazardous: true if the material requires special administrative review or handling due to toxicity, flammability, etc.
      
      Return professional B2B marketplace copy and realistic approximate sustainability metrics.
      Keep all money values in INR as strings.
    `;

    const parts: any[] = [prompt];
    if (imagePart) parts.push(imagePart);

    const aiResult = await model.generateContent(parts);
    const response = await aiResult.response;
    const text = response.text();
    const aiData = extractJsonObject(text);

    // Return analyzed data instead of directly creating
    const finalIsHazardous = (userIsHazardous === 'true' || userIsHazardous === true) ? true : aiData.isHazardous;

    res.json({
      success: true,
      data: {
        ...aiData,
        quantity: quantity || "",
        unit: unit || "kg",
        province: province || "",
        image_url: uploadedImageUrl,
        isHazardous: finalIsHazardous
      }
    });

  } catch (error) {
    console.error('Error generating AI listing:', error);
    const message = error instanceof Error ? error.message : 'Failed to process listing with AI';
    res.status(500).json({ error: message });
  }
});

app.post('/api/listings/create-final', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();

    // ── Symbiosis Engine: find matching demand requests ──
    setImmediate(async () => {
      try {
        const keywords = [
          newListing.title,
          newListing.material_type,
          newListing.category,
        ].filter(Boolean).map(s => s!.toLowerCase());

        const allDemands = await DemandRequest.find({ status: 'active' });
        const matches = allDemands.filter(demand => {
          const needle = demand.materialName.toLowerCase();
          return keywords.some(k => k.includes(needle) || needle.includes(k));
        });

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@sfridoo.com';
        const sgReady = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'YOUR_SENDGRID_API_KEY_HERE';

        for (const demand of matches) {
          console.log(`[Symbiosis] Match found: "${newListing.title}" → ${demand.companyName} <${demand.contactEmail}>`);

          if (sgReady) {
            const msg = {
              to: demand.contactEmail,
              from: fromEmail,
              subject: `🔄 Sfridoo Match: ${newListing.title} is now available!`,
              html: `
                <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;">
                  <div style="background:#1a2e1a;padding:32px 40px;border-radius:16px 16px 0 0;">
                    <h1 style="color:#fff;margin:0;font-size:24px;">♻️ Sfridoo Symbiosis Alert</h1>
                    <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">A material match was found for your demand request</p>
                  </div>
                  <div style="background:#f9f9f6;padding:32px 40px;border-radius:0 0 16px 16px;border:1px solid #e5e5e0;">
                    <p style="color:#555;font-size:15px;">Hi <strong>${demand.companyName}</strong>,</p>
                    <p style="color:#555;font-size:15px;">Great news! A new listing matching your demand for <strong>${demand.materialName}</strong> has just been posted on the Sfridoo marketplace:</p>
                    <div style="background:#fff;border:1px solid #e0e0e0;border-radius:12px;padding:20px 24px;margin:20px 0;">
                      <h2 style="color:#1C1F2A;margin:0 0 8px;font-size:18px;">${newListing.title}</h2>
                      <p style="color:#777;margin:0 0 12px;font-size:13px;">${newListing.description || ''}</p>
                      <table style="width:100%;font-size:13px;color:#555;">
                        <tr><td style="padding:4px 0;"><strong>Category:</strong></td><td>${newListing.category || '—'}</td></tr>
                        <tr><td style="padding:4px 0;"><strong>Material:</strong></td><td>${newListing.material_type || '—'}</td></tr>
                        <tr><td style="padding:4px 0;"><strong>Quantity:</strong></td><td>${newListing.quantity} ${newListing.unit || 'kg'}</td></tr>
                        <tr><td style="padding:4px 0;"><strong>Est. Value/Unit:</strong></td><td>${newListing.estimated_value_per_unit || 'TBD'}</td></tr>
                        <tr><td style="padding:4px 0;"><strong>Province:</strong></td><td>${newListing.province || '—'}</td></tr>
                      </table>
                    </div>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/product/${newListing._id}" style="display:inline-block;background:#1a2e1a;color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:15px;font-weight:600;">View Listing →</a>
                    <p style="color:#aaa;font-size:12px;margin-top:32px;">You are receiving this because you registered a demand for <em>${demand.materialName}</em> on Sfridoo. <a href="#" style="color:#aaa;">Unsubscribe</a></p>
                  </div>
                </div>
              `,
            };
            await sgMail.send(msg);
            console.log(`[Symbiosis] Email sent to ${demand.contactEmail}`);
          }
        }
      } catch (err) {
        console.error('[Symbiosis] Matching error:', err);
      }
    });

    res.json({ success: true, data: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

/* ── Demand Requests (Symbiosis Engine) ── */

app.post('/api/demand', async (req, res) => {
  try {
    const { companyName, contactEmail, materialName, category, quantityNeeded, unit, province, description } = req.body;
    if (!companyName || !contactEmail || !materialName) {
      return res.status(400).json({ error: 'companyName, contactEmail and materialName are required' });
    }
    const demand = new DemandRequest({ companyName, contactEmail, materialName, category, quantityNeeded, unit, province, description });
    await demand.save();
    res.status(201).json({ success: true, data: demand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save demand request' });
  }
});

app.get('/api/demand', async (req, res) => {
  try {
    const demands = await DemandRequest.find().sort({ createdAt: -1 });
    res.json(demands);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch demand requests' });
  }
});

app.delete('/api/demand/:id', async (req, res) => {
  try {
    await DemandRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete demand request' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.get('/api/listings/seed', async (req, res) => {
  try {
    await Listing.insertMany([
      {
        title: "Table waste/banks/cashboxes",
        category: "Wood",
        framing: "Warehouse Leftover",
        quantity: 20000,
        unit: "kg",
        province: "Chieti",
        image_url: "https://via.placeholder.com/150",
      }
    ]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).send("Error seeding");
  }
});

app.post('/api/payments/razorpay/order', async (req, res) => {
  try {
    if (!razorpayClient) {
      return res.status(500).json({ error: 'Razorpay is not configured' });
    }

    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: 'listingId is required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const totalEstimated = parseInrValue(listing.total_estimated_value);
    const unitEstimated = parseInrValue(listing.estimated_value_per_unit);
    const computed = unitEstimated && listing.quantity
      ? unitEstimated * listing.quantity
      : null;

    const amountInr = totalEstimated ?? computed;
    if (!amountInr || amountInr <= 0) {
      return res.status(400).json({ error: 'Listing amount is invalid' });
    }

    const order = await razorpayClient.orders.create({
      amount: Math.round(amountInr * 100),
      currency: 'INR',
      receipt: `listing_${listing._id}`,
      notes: {
        listingId: String(listing._id),
        title: listing.title || 'Listing',
      },
    });

    res.json({
      keyId: razorpayKeyId,
      order,
    });
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

app.post('/api/payments/razorpay/verify', async (req, res) => {
  try {
    if (!razorpayKeySecret) {
      return res.status(500).json({ error: 'Razorpay is not configured' });
    }

    const { orderId, paymentId, signature, listingId } = req.body;
    if (!orderId || !paymentId || !signature || !listingId) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(payload)
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const updated = await Listing.findByIdAndUpdate(
      listingId,
      { status: 'sold' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, listing: updated });
  } catch (error) {
    console.error('Failed to verify Razorpay payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

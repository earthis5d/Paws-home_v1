import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Supabase Admin Client (Service Role)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let supabaseAdmin: any = null;
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log("Supabase Admin Client initialized.");
  } else {
    console.warn("SUPABASE_SERVICE_ROLE_KEY missing. Admin features will be disabled.");
  }

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example Admin Endpoint: Get global stats bypassing RLS
  app.get("/api/admin/stats", async (req, res) => {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: "Admin client not configured" });
    }

    try {
      // Fetching counts bypassing RLS
      const { count: petCount, error: petError } = await supabaseAdmin
        .from('pets')
        .select('*', { count: 'exact', head: true });

      const { count: shelterCount, error: shelterError } = await supabaseAdmin
        .from('shelters')
        .select('*', { count: 'exact', head: true });

      const { count: adoptionCount, error: adoptionError } = await supabaseAdmin
        .from('adoption_requests')
        .select('*', { count: 'exact', head: true });

      if (petError || shelterError || adoptionError) {
        throw new Error("Failed to fetch stats");
      }

      res.json({
        totalPets: petCount || 0,
        totalShelters: shelterCount || 0,
        totalAdoptions: adoptionCount || 0
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // On récupère le corps de la requête
      const {
        name,
        price,
        description,
        missionId, 
        aircraftId,
        organizationId,
        status,
      } = req.body;

      // On vérifie que les champs requis nécéssaires soient présents
      if (!name || !price || !description || !missionId) {
        res.status(400).json({ error: "Champs requis manquants" });
        return;
      }

      // On vient créer un produit dans Stripe
      const product = await stripe.products.create({
        name,
        description,
        metadata: {
          missionId,
          aircraftId,
          organizationId,
          status,
        },
      });

      // On créer le prix sur Stripe
      await stripe.prices.create({
        unit_amount: price,
        currency: "usd",
        product: product.id,
      });

      // Retourne un message indiquant que le produit a été crée
      res.status(200).json({ message: "Le produit a été crée" });
    } catch (error) {
      // Retourne une erreur
      res
        .status(500)
        .json({
          error: "Impossible de créer le produit",
          details: error.message,
        });
    }
  } else {
    // Méthode non autorisée
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}

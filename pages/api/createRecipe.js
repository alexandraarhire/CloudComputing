import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, ingredients, instructions, difficulty } = req.body;

    if (!title || !ingredients || !instructions || !difficulty) {
      return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
    }

    try {
      const client = await clientPromise;
      const db = client.db();
      const recipesCollection = db.collection("recipes");

      const existingRecipe = await recipesCollection.findOne({
        $or: [
          { title: title }
        ]
      });

      if (existingRecipe) {
        return res.status(400).json({ message: "O rețetă cu acest titlu există deja." });
      }

      await recipesCollection.insertOne({ title, ingredients, instructions, difficulty });

      return res.status(200).json({ message: "Rețeta a fost adăugată cu succes!" });
    } catch (error) {
      console.error("Eroare la adăugarea în baza de date:", error);
      return res.status(500).json({ message: "A apărut o eroare la adăugarea rețetei. Te rugăm să încerci din nou mai târziu." });
    }
  }

  return res.status(405).json({ message: "Metoda HTTP nu este permisa." });
}

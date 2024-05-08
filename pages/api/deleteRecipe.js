import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db();
      const recipesCollection = db.collection("recipes");

      const recipes = await recipesCollection.find({}).toArray();

      return res.status(200).json(recipes);
    } catch (error) {
      console.error("Eroare la obținerea datelor din baza de date:", error);
      return res.status(500).json({ message: "A apărut o eroare la obținerea rețetelor." });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query; // Obținem ID-ul rețetei din parametrii cererii

    try {
      const client = await clientPromise;
      const db = client.db();

      // Ștergem rețeta cu ID-ul specificat
      await db.collection("recipes").deleteOne({ _id: id });

      // După ștergere, actualizăm lista de rețete rămase și o returnăm
      const updatedRecipes = await db.collection("recipes").find({}).toArray();
      return res.status(200).json(updatedRecipes);
    } catch (error) {
      console.error("Eroare la ștergerea rețetei:", error);
      return res.status(500).json({ message: "A apărut o eroare la ștergerea rețetei." });
    }
  }

  return res.status(405).json({ message: "Metoda HTTP nu este permisă." });
}

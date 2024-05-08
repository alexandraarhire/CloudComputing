import { ObjectId } from 'mongodb';
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query; 

    try {
      const client = await clientPromise;
      const db = client.db();
      
      const recipeId = new ObjectId(id);  

     
      const result = await db.collection("recipes").deleteOne({ _id: recipeId });

      if (result.deletedCount === 1) {
     
        const updatedRecipes = await db.collection("recipes").find({}).toArray();
        return res.status(200).json(updatedRecipes);
      } else {
        return res.status(404).json({ message: "Rețeta nu a fost găsită." });
      }
    } catch (error) {
      console.error("Eroare la ștergerea rețetei:", error);
      return res.status(500).json({ message: "A apărut o eroare la ștergerea rețetei." });
    }
  } else {
    return res.status(405).json({ message: "Metoda HTTP nu este permisă." });
  }
}

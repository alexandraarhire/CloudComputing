import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Șterge toate rețetele
    await db.collection("recipes").deleteMany({});

    res.status(200).json({ message: "Toate rețetele au fost șterse cu succes!" });
  } catch (error) {
    console.error("Eroare la ștergerea tuturor rețetelor:", error);
    res.status(500).json({ message: "A apărut o eroare la ștergerea tuturor rețetelor." });
  }
}

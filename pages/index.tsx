import { useState, FormEvent, useEffect } from "react";
import clientPromise from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type Recipe = {
  _id: string;
  title: string;
  ingredients: string;
  instructions: string;
  difficulty: string;
};

type ConnectionStatus = {
  isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async () => {
  try {
    await clientPromise;
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [registerTitle, setRegisterTitle] = useState(""); 
  const [registerIngredients, setRegisterIngredients] = useState("");
  const [registerInstructions, setRegisterInstructions] = useState(""); 
  const [registerDifficulty, setRegisterDifficulty] = useState(""); 
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("/api/getRecipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          setError("A apărut o eroare la obținerea rețetelor.");
        }
      } catch (error) {
        console.error("Eroare la obținerea rețetelor:", error);
        setError("A apărut o eroare la obținerea rețetelor.");
      }
    }

    fetchRecipes();
  }, []);

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!registerTitle || !registerIngredients || !registerInstructions || !registerDifficulty) {
      setError("Te rog completează toate câmpurile!");
      return;
    }

    try {
      const response = await fetch("/api/createRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: registerTitle, 
          ingredients: registerIngredients, 
          instructions: registerInstructions, 
          difficulty: registerDifficulty 
        }),
      });

      if (response.ok) {
        setError("");
        setRegisterTitle("");
        setRegisterIngredients("");
        setRegisterInstructions("");
        setRegisterDifficulty("");
        alert("Rețeta a fost creată cu succes!");
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Eroare la înregistrare:", error);
      setError("A apărut o eroare la crearea rețetei.");
    }
  };

  return (
    <div style={{ 
      maxWidth: "1000px", 
      margin: "0 auto", 
      textAlign: "center", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f0f0f0",
      borderRadius: "10px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div style={{ width: "45%", padding: "1rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Gestionare Rețete</h2>
        <form onSubmit={handleRegisterSubmit} style={{ marginTop: "20px" }}>
          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerTitle" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left" ,       fontFamily: "Arial, sans-serif"  }}>Titlu:</label>
            <input
              type="text"
              id="registerTitle"
              value={registerTitle}
              onChange={(e) => setRegisterTitle(e.target.value)}
              style={{ width: "100%", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem",       fontFamily: "Arial, sans-serif" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerIngredients" style={{ display: "block", marginBottom: "0.5rem",  textAlign:"left",       fontFamily: "Arial, sans-serif"}}>Ingrediente:</label>
            <textarea
              id="registerIngredients"
              value={registerIngredients}
              onChange={(e) => setRegisterIngredients(e.target.value)}
              style={{ width: "100%", minHeight: "100px", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem",       fontFamily: "Arial, sans-serif" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerInstructions" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left",       fontFamily: "Arial, sans-serif" }}>Instrucțiuni:</label>
            <textarea
              id="registerInstructions"
              value={registerInstructions}
              onChange={(e) => setRegisterInstructions(e.target.value)}
              style={{ width: "100%", minHeight: "100px", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem",       fontFamily: "Arial, sans-serif" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerDifficulty" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left",       fontFamily: "Arial, sans-serif" }}>Dificultate:</label>
            <select
              id="registerDifficulty"
              value={registerDifficulty}
              onChange={(e) => setRegisterDifficulty(e.target.value)}
              style={{ width: "100%", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem",       fontFamily: "Arial, sans-serif" }}
            >
              <option value="" style={{fontFamily:"Arial, sans-serif"}}>Alegeți dificultatea</option>
              <option value="Ușor" style={{fontFamily:"Arial, sans-serif"}}>Ușor</option>
              <option value="Mediu" style={{fontFamily:"Arial, sans-serif"}}>Mediu</option>
              <option value="Dificil" style={{fontFamily:"Arial, sans-serif"}}>Dificil</option>
            </select>
          </div>
          <button 
            type="submit" 
            style={{ 
              marginTop: "10px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "0.25rem", 
              padding: "0.5rem 1rem", 
              cursor: "pointer" 
            }}
          >
            Creare Rețetă
          </button>
        </form>
      </div>
      <div style={{ width: "65%", padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Rețete</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          {recipes.map((recipe) => (
            <div key={recipe._id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "0.25rem" }}>
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}><strong style={{color: "blue"}}>Titlu:</strong> {recipe.title}</h3>
              <p style={{ marginBottom: "0.25rem" }}><strong>Ingrediente:</strong> {recipe.ingredients}</p>
              <p style={{ marginBottom: "0.25rem" }}><strong>Instrucțiuni:</strong> {recipe.instructions}</p>
              <p style={{ marginBottom: "0.25rem" }}><strong>Dificultate:</strong> {recipe.difficulty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

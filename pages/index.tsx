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

export default function BlogCulinar({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [registerTitle, setRegisterTitle] = useState(""); 
  const [registerIngredients, setRegisterIngredients] = useState("");
  const [registerInstructions, setRegisterInstructions] = useState(""); 
  const [registerDifficulty, setRegisterDifficulty] = useState(""); 
  const [filterDifficulty, setFilterDifficulty] = useState(""); // Adăugăm starea pentru filtrul de dificultate
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

  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/deleteRecipe?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedRecipes = recipes.filter(recipe => recipe._id !== id);
        setRecipes(updatedRecipes);
        alert("Rețeta a fost ștearsă cu succes!");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Eroare la ștergerea rețetei:", error);
      setError("A apărut o eroare la ștergerea rețetei.");
    }
  };

  const handleFilterChange = (e: FormEvent<HTMLSelectElement>) => {
    setFilterDifficulty(e.currentTarget.value);
  };

  return (
    <div style={{ 
      maxWidth: "1000px", 
      margin: "0 auto", 
      textAlign: "center", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f0f0f0",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", fontFamily: "Georgia, serif", color: "#333" }}>Blog Culinar</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <form onSubmit={handleRegisterSubmit} style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}>
          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerTitle" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left", color: "#333" }}>Titlu:</label>
            <input
              type="text"
              id="registerTitle"
              value={registerTitle}
              onChange={(e) => setRegisterTitle(e.target.value)}
              style={{ width: "100%", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerIngredients" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left", color: "#333" }}>Ingrediente:</label>
            <textarea
              id="registerIngredients"
              value={registerIngredients}
              onChange={(e) => setRegisterIngredients(e.target.value)}
              style={{ width: "100%", minHeight: "100px", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerInstructions" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left", color: "#333" }}>Instrucțiuni:</label>
            <textarea
              id="registerInstructions"
              value={registerInstructions}
              onChange={(e) => setRegisterInstructions(e.target.value)}
              style={{ width: "100%", minHeight: "100px", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="registerDifficulty" style={{ display: "block", marginBottom: "0.5rem", textAlign:"left", color: "#333" }}>Dificultate:</label>
            <select
              value={registerDifficulty}
              onChange={(e) => setRegisterDifficulty(e.target.value)}
              style={{ width: "100%", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem" }}
            >
              <option value="">Alegeți dificultatea</option>
              <option value="Ușor">Ușor</option>
              <option value="Mediu">Mediu</option>
              <option value="Dificil">Dificil</option>
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
          <label htmlFor="filterDifficulty" style={{ marginRight: "10px", textAlign: "right", fontFamily: "Arial, sans-serif", color: "#333" }}>Filtrare după dificultate:</label>
          <select
            id="filterDifficulty"
            value={filterDifficulty}
            onChange={handleFilterChange}
            style={{ border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.5rem", fontFamily: "Arial, sans-serif" }}
          >
            <option value="">Toate nivelurile</option>
            <option value="Ușor">Ușor</option>
            <option value="Mediu">Mediu</option>
            <option value="Dificil">Dificil</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "20px" }}>
        {recipes
          .filter(recipe => !filterDifficulty || recipe.difficulty === filterDifficulty) // Aplicăm filtrul de dificultate
          .map((recipe) => (
            <div key={recipe._id} style={{ 
              border: "1px solid #ccc", 
              padding: "1rem", 
              borderRadius: "0.25rem",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease-in-out",
              ":hover": {
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
              }
            }}>
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem", color: "#007bff" }}><strong>Titlu:</strong> {recipe.title}</h3>
              <p style={{ marginBottom: "0.25rem" }}><strong>Ingrediente:</strong> {recipe.ingredients}</p>
              <p style={{ marginBottom: "0.25rem" }}><strong>Instrucțiuni:</strong> {recipe.instructions}</p>
              <p style={{ marginBottom: "0.25rem" }}><strong>Dificultate:</strong> {recipe.difficulty}</p>
              <button 
                onClick={() => handleDeleteRecipe(recipe._id)} 
                style={{ 
                  backgroundColor: "red", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "0.25rem", 
                  padding: "0.25rem 0.5rem", 
                  cursor: "pointer",
                  marginTop: "0.5rem"
                }}
              >
                Șterge
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
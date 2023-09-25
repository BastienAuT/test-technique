"use client";
import axios from "axios";
import { useState } from "react";
import stripTags from "strip-tags";
import styles from "./checkOutForm.module.css";

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    organizationId: "",
    aircraftId: "",
    missionId: "",
    name: "",
    price: "",
    description: "",
    status: "",
  });

  const [status, setStatus] = useState("en attente");

const handleChange = (e) => {
  // On utilise la propriété `selectedOptions` de la balise `select` pour récupérer la valeur sélectionnée.
  if (e.target.name === "status") {
    const selectedOptions = e.target.selectedOptions;

    if (selectedOptions.length > 0) {
      setFormData({ ...formData, [e.target.name]: selectedOptions[0].value });
    } else {
      setFormData({ ...formData, [e.target.name]: "" });
    }
  } else {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("en attente");

    // On vient valider l'input du prix pour qu'il ne soit pas négatif (prix du devis par exemple).
    if (formData.price < 0 || !formData.missionId.match(/^[0-9]+$/)) {
      return res.status(400).send("Input incorrect");
    }

    // On vient échapper les input pour encoder les caractères spéciaux.
    const escapedFormData = {
      ...formData,
      name: stripTags(formData.name),
      price: stripTags(formData.price),
      description: stripTags(formData.description),
      missionId: stripTags(formData.missionId),
      aircraftId: stripTags(formData.aircraftId),
      organizationId: stripTags(formData.organizationId),
      status: formData.status,
    };

    try {
      const response = await axios.post("/api/createProduct", escapedFormData);

      setStatus("success");
      // Renvoie la réussite du call depuis l'api
    } catch (error) {
      setStatus("error");
      // Renvoie les erreurs depuis l'api
    }

    // On vient supprimer les input une fois qu'on appuie sur submit avec la méthode clearInputs
    clearInputs();
  };

  const clearInputs = () => {
    setFormData({
      status: "",
      organizationId: "",
      aircraftId: "",
      missionId: "",
      name: "",
      price: "",
      description: "",
    });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1>Bonjour , veuillez ajouter vos informations</h1>
      <input
        className={styles.input}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nom"
        required
      />
      <input
        className={styles.input}
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Prix"
        required
      />
      <input
        className={styles.input}
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        className={styles.input}
        type="number"
        name="missionId"
        value={formData.missionId}
        onChange={handleChange}
        placeholder="ID mission"
        required
      />
      <input
        className={styles.input}
        type="number"
        name="aircraftId"
        value={formData.aircraftId}
        onChange={handleChange}
        placeholder="ID appareil (optionnel)"
      />
      <input
        className={styles.input}
        type="text"
        name="organizationId"
        value={formData.organizationId}
        onChange={handleChange}
        placeholder="ID organisme (optionnel)"
      />

      <label className={styles.label}htmlFor="status">Statut du vol</label>
      <select
        className={styles.select}
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option className={styles.option} value="accepté">Accepté</option>
        <option className={styles.option} value="modifié">Modifié</option>
        <option className={styles.option} value="annulé">Annulé</option>
      </select>

      <button className={styles.button} type="submit">
        Envoyer
      </button>
      {status === "success" && (
        <h3 style={{ color: "green" }}>Produit crée avec succes!</h3>
      )}
      {status === "error" && (
        <h3 style={{ color: "red" }}>Impossible de créer le produit.</h3>
      )}
    </form>
  );
}

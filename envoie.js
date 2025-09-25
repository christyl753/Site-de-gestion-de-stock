document
  .getElementById("submitBtn")
  .addEventListener("click", async function () {
    const form = document.getElementById("form");
    const formData = {
      Nom: form.nom.value,
      Prenom: form.prenom.value,
      mail: form.mail.value,
      naissance: form.date.value,
      Password: form.pwd.value,
    };

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Données envoyées avec succès : " + result.message);
      } else {
        alert("Erreur lors de l'envoi des données");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur s'est produite");
    }
  });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware'ler
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");


// JSON Server için API URL
const API_URL = "http://localhost:4444/todos";

// Ana sayfa - Görevleri getir ve göster
app.get("/", async (req, res) => {
    const todos = await fetch(API_URL).then(res => res.json());
    res.render("index", { todos });
});

// Yeni görev ekleme
app.post("/add", async (req, res) => {
    const { title } = req.body;
    await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ title, completed: false }),
        headers: { "Content-Type": "application/json" }
    });
    res.redirect("/");
});

// Görev güncelleme (tamamlama durumu değiştir)
app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { title } = req.body; // Yeni başlığı al

    try {
        // Güncellenen görevi al
        const todo = await fetch(`${API_URL}/${id}`).then(res => res.json());

        // Güncelleme isteği gönder
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...todo,
                title: title // Yeni başlık ekleniyor
            }),
            headers: { "Content-Type": "application/json" }
        });

        res.sendStatus(200); // Başarılı
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.sendStatus(500);
    }
});



// Görev silme
app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    res.redirect("/");
});

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));

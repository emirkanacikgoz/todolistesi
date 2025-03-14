$(document).ready(function () {
    $(".update-btn").click(function () {
        let listItem = $(this).closest("li"); // İlgili liste öğesini al
        let textSpan = listItem.find("span"); // Mevcut metni al
        let currentText = textSpan.text(); // Görevin mevcut başlığı
        let id = listItem.find(".update-form").data("id"); // ID'yi al

        // Güncelleme butonunu gizle
        $(this).hide();

        // Input alanı oluştur
        let inputField = $(`<input type="text" class="form-control form-control-sm" value="${currentText}">`);
        textSpan.replaceWith(inputField); // Metni input ile değiştir

        // Onay butonu ekle
        let confirmBtn = $(`<button class="btn btn-success btn-sm ms-2">✔</button>`);
        listItem.find("div").prepend(confirmBtn);

        // Onay butonuna tıklanınca güncelleme yap
        confirmBtn.click(function () {
            let newTitle = inputField.val();

            if (newTitle.trim() !== "") {
                $.ajax({
                    url: `/update/${id}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({ title: newTitle }),
                    success: function () {
                        inputField.replaceWith(`<span>${newTitle}</span>`); // Input'u tekrar metne çevir
                        confirmBtn.remove(); // Onay butonunu kaldır
                        listItem.find(".update-btn").show(); // Güncelleme butonunu geri getir
                    },
                    error: function (err) {
                        console.error("Güncelleme hatası:", err);
                    }
                });
            }
        });
    });
});

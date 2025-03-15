$(document).ready(function () {
    // checkbox değiştiğinde tamamlanma durumunu güncelle
    $(".task-checkbox").change(function () {
        let id = $(this).data("id"); // görev id'sini alma
        let listItem = $(this).closest("li");
        let taskText = listItem.find(".task-text");

        // ajax tamamlama durumu güncelleme
        $.ajax({
            url: `/toggle/${id}`,
            method: "POST",
            success: function () {
                taskText.toggleClass("completed"); // üstünü çizme
            },
            error: function (err) {
                console.error("Güncelleme hatası:", err);
            }
        });
    });

    // güncelleme butonuna basıldığında
    $(".update-btn").click(function () {
        let listItem = $(this).closest("li"); // güncellenecek liste öğesini al
        let textSpan = listItem.find(".task-text"); // mevcut metni al
        let currentText = textSpan.text(); // görevin mevcut başlığı
        let id = listItem.find(".update-form").data("id"); // id'yi al
        let isCompleted = listItem.find(".task-checkbox").is(":checked"); // görev tamamlama durumunu kontrol

        // güncelleme butonu ve checkbox gizleme
        $(this).hide();
        listItem.find(".task-checkbox").hide();

        // input alanı oluşturma
        let inputField = $(`<input type="text" class="form-control form-control-sm edit-input" value="${currentText}">`);
        textSpan.replaceWith(inputField); // Metni input ile değiştir

        // güncelleme için onay butonu ekleme
        let confirmBtn = $(`<button class="btn btn-primary btn-sm ms-2 confirm-edit-btn">✔</button>`);
        listItem.find(".btn-group").prepend(confirmBtn);

        // onay butonuna tıklanınca güncelleme yapma
        confirmBtn.click(function () {
            let newTitle = inputField.val();

            if (newTitle.trim() !== "") {
                $.ajax({
                    url: `/update/${id}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({ title: newTitle }),
                    success: function () {
                        let updatedSpan = $(`<span class="task-text">${newTitle}</span>`);
                        if (isCompleted) updatedSpan.addClass("completed"); // eğer görev tamamlanmışsa üstü çizili kalsın
                        
                        inputField.replaceWith(updatedSpan); // inputu tekrar metne çevir
                        confirmBtn.remove(); // onay butonunu kaldırma
                        listItem.find(".update-btn").show(); // güncelleme butonunu geri getir
                        listItem.find(".task-checkbox").show(); // checkbox geri getir
                    },
                    error: function (err) {
                        console.error("Güncelleme hatası:", err);
                    }
                });
            }
        });
    });
});

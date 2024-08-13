import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images',{
    multiple: true,
    maxFileCount: 6
});
// Client send message
const formSendDate = document.querySelector(".chat .inner-form");
if(formSendDate) {
    formSendDate.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;
        if(content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
        }
    })
}
//end
// server return message
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";
    if(myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }
    if(data.content) {
        htmlContent = `<div class="inner-content">${data.content}</div>`
    }
    if(data.images.length > 0) {
        htmlImages += `<div class="inner-images">`;
        for(const image of data.images) {
            htmlImages += `<img src="${image}">`;
        }
        htmlImages += `</div>`;
    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    body.appendChild(div);
    body.scrollTop = bodyChat.scrollHeight;
    const gallery = new Viewer(div);
})
//end
// scroll chat to bottom
const bodyChat =document.querySelector(".chat .inner-body");
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//end
//show icon chat
const buttonIcon = document.querySelector('.button-icon');
if(buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.onclick = () => {
        tooltip.classList.toggle("shown");
    }
}
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        inputChat.value = inputChat.value + icon;
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();
    })
}

//end show icon chat
//preview full image
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if(bodyChatPreviewImage) {
    const gallery = new Viewer(bodyChatPreviewImage);
}
//end preview full image

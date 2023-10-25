document.addEventListener("DOMContentLoaded", function () {
    const shopContentData = JSON.parse(localStorage.getItem("basket"));

    if (shopContentData) {
        const shopContentContainer = document.getElementById("shop-content-container");

        shopContentData.forEach(item => {
            const productItemDiv = document.createElement("div");
            productItemDiv.classList.add("product-item");

            productItemDiv.innerHTML = `
           
                <img src="${item.images}">
                <span style="color: black">Product Price: ${item.price} USD</span>
                <span>Quantity: ${item.count}</span>
                <span>Total: ${item.price * item.count} USD</span>
                <i class="fa-solid fa-trash" data-id="${item.id}"></i>
               
            `
            ;

            shopContentContainer.appendChild(productItemDiv);
        });

        shopContentContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("fa-trash")) {
                const productId = event.target.getAttribute("data-id");
                const productIndex = shopContentData.findIndex(item => item.id == productId);
    
                if (productIndex !== -1) {
                    
                    shopContentData.splice(productIndex, 1);
                    localStorage.setItem("basket", JSON.stringify(shopContentData));
    
                    const productItem = event.target.parentElement;
                    shopContentContainer.removeChild(productItem);
                }
            }
        });
    }
});

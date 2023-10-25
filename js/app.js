window.addEventListener("scroll", () => {
  myFunction();
});

const header = document.querySelector("header")
const bottomHeader = document.querySelector(".announcebar");
let isSticky = false;

const myFunction = () => {
  const scrollY = window.scrollY;
  if (scrollY > 0 && !isSticky) {
    header.classList.add("sticky");
    bottomHeader.style.display = "none";
    isSticky = true;
  } else if (scrollY === 0 && isSticky) {
    header.classList.remove("sticky");
    bottomHeader.style.display = "block";
    isSticky = false;
  }
};
let shopIcon = document.querySelector("#shop-icon");
let shop = document.querySelector(".shop");
let closeShop = document.querySelector("#close-shop");

shopIcon.addEventListener("click", () => {
  shop.classList.add("active");
});

closeShop.addEventListener("click", () => {
  shop.classList.remove("active");
});



var swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

});
let totPrice = document.querySelector(".total-price");
let productCount = document.querySelector(".count-1");
let productPrice = document.querySelector(".productPrice");
let minus = document.querySelector(".minus")
let plus = document.querySelector(".plus")
let basket = JSON.parse(localStorage.getItem("basket"));

if (localStorage.getItem("basket") === null) {
  localStorage.setItem("basket", JSON.stringify([]));
  productCount.innerText = "0";
  productPrice.innerText = "0";
} else {
  let basket = JSON.parse(localStorage.getItem("basket"));
  productCount.innerText = basket.length;
  let price = 0;
  basket.forEach(elem => {
    price += elem.price * elem.count;
  });
  productPrice.innerText = price;
}

let slider = document.querySelector(".swiper-wrapper");
fetch("http://localhost:3000/products", {
  method: "GET",
})
  .then(response => response.json())
  .then(data => {
    data.forEach(e => {
      slider.innerHTML +=
        `
        <div class="swiper-slide">
          <div class="slide-img">
            <h1>${e.description}</h1>
            <p>Type: ${e.brand}</p>
            <img src=${e.images}>
            <h5>Size:</h5>
            <select>
              <option>32</option>
              <option>28</option>
            </select>
            <br>
            <span>${e.price}</span>
            <b>USD</b>
            <button id="Card" data-price="${e.price}" data-id="${e.id}" data-img="${e.images}">Add to Cart</button>
          </div>
          <div class="eye">
            <i class="fa-solid fa-heart"></i>
            <i class="fa-solid fa-eye eyecursor" data-title="${e.description}" data-price="${e.price}" data-id="${e.id}" data-img="${e.images}"></i>
            <i class="fa-solid fa-repeat"></i>
          </div>
        </div>
        `
    });

    let addBasket = document.querySelectorAll("#Card");
    addBasket.forEach(btn => {
      btn.addEventListener("click", function () {
        if (localStorage.getItem("basket") === null) {
          localStorage.setItem("basket", JSON.stringify([]));
        }

        let data_id = this.getAttribute("data-id");
        let data_price = this.getAttribute("data-price");
        let data_image = this.getAttribute("data-img");
        let exist = basket.find(a => a.id == data_id);

        if (exist) {
          exist.count++;
        } else {
          basket.push({
            id: data_id,
            price: data_price,
            count: 1,
            images: data_image,
          });
        }

        productCount.innerText = basket.length;
        let price = 0;
        basket.forEach(element => {
          price += Number(element.price) * Number(element.count);
        });

        productPrice.innerText = price;
        totPrice.innerText = price;
        localStorage.setItem("basket", JSON.stringify(basket));


        let shopContent = document.querySelector(".shop-content");
shopContent.innerHTML = "";

basket.forEach(item => {
  shopContent.innerHTML +=
    `
    <div class="product-item">
      <img src="${item.images}">
      <span style="color: black">Product Price: ${item.price} USD</span>
      <br>
      <button class="decrease" data-id=${item.id}>-</button>
      <span>Quantity:<span class="totalProductCount">${item.count}</span>
      <button class="increase" data-id=${item.id}>+</button>
      </span>
      <span class="total-price">Total: ${item.price * item.count} USD</span>
      <i class="fa-solid fa-trash" data-id="${item.id}"></i>
    </div>
    `
});

let totalProductCount = document.querySelectorAll('.totalProductCount');
let decrease = document.querySelectorAll('.decrease');
let increase = document.querySelectorAll('.increase');
let totalPrices = document.querySelectorAll('.total-price'); 

increase.forEach((plus, index) => {
  plus.addEventListener('click', () => {
    totalProductCount[index].innerHTML++;
    updateTotalPrice(index); 
  });
});

decrease.forEach((minus, index) => {
  minus.addEventListener('click', () => {
    if (totalProductCount[index].innerHTML > 0) {
      totalProductCount[index].innerHTML--;
      updateTotalPrice(index); 

      if (totalProductCount[index].innerHTML == 0) {
        const productId = basket[index].id;
        const productIndex = basket.findIndex(item => item.id == productId);

        if (productIndex !== -1) {
          basket.splice(productIndex, 1);
          localStorage.setItem("basket", JSON.stringify(basket));
          let price = 0
          productCount.innerText = basket.length;
          basket.forEach(item => {
            price += Number(item.price) * Number(item.count);
          });

          productPrice.innerText = price;
          totPrice.innerText = price;

          const productItem = minus.closest(".product-item")
          shopContent.removeChild(productItem);
        }
      }
    }
  });
});

function updateTotalPrice(index) {
  const price = basket[index].price * totalProductCount[index].innerHTML;
  totalPrices[index].innerHTML = `Total: ${price} USD`;
  updateBasketTotalPrice();
}

function updateBasketTotalPrice() {
  let totalPrice = 0;
  basket.forEach((item, index) => {
    totalPrice += item.price * totalProductCount[index].innerHTML;
  });
  totPrice.innerText = totalPrice;
}

              
        
        
           

        shopContent.addEventListener("click", function (event) {
          if (event.target.classList.contains("fa-trash")) {
            const productId = event.target.getAttribute("data-id");
            const productIndex = basket.findIndex(item => item.id == productId);

            if (productIndex !== -1) {
              basket.splice(productIndex, 1);
              localStorage.setItem("basket", JSON.stringify(basket));
              let price = 0;
              productCount.innerText = basket.length;

              basket.forEach(item => {
                price += Number(item.price) * Number(item.count);
              });

              productPrice.innerText = price;
              totPrice.innerText = price;

              const productItem = event.target.parentElement;
              shopContent.removeChild(productItem);
            }
          }
        });
      });
    });
    let showProductIcon = document.querySelectorAll('.eyecursor');
    let basket2 = JSON.parse(localStorage.getItem("basket2")) || [];
    let showProductWindow = document.querySelector('.showProductWindow');
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("closeProductWindow")) {
        showProductWindow.style.display = 'none';
      }
    });


    showProductIcon.forEach(show => {
      show.addEventListener('click', function () {
        let data_id = this.getAttribute("data-id");
        let data_price = this.getAttribute("data-price");
        let data_image = this.getAttribute("data-img");
        let data_title = this.getAttribute("data-title");
        let data_type = this.getAttribute("data-type");
        let exist = basket2.find(a => a.id == data_id);

        if (exist) {
          exist.count++;
        } else {
          basket2.push({
            id: data_id,
            price: data_price,
            image: data_image,
            title: data_title,
            type: data_type,
            count: 1
          });
        }

        localStorage.setItem("basket2", JSON.stringify(basket2));

        showProductWindow.style.display = 'flex';
        showProductWindow.innerHTML = `
                    <div class="window">
                        <i class="fa-solid fa-xmark closeProductWindow"></i>
                        <div class="left">
                            <p class="windowTitle"> ${data_title} </p>
                            <p class="windowDescription"> Exceptional Full HD IPS 21.5 Inch Ultra Thin Display : Enjoy immaculate image quality with 1920x1080 resolution and 178 degree wide viewing angles I Zero... </p>
                            <p class="windowSize"> Size: </p>
                            <div class="windowSelect">
                                <select>
                                    <option></option>
                                </select>
                                <img src="https://gaming-workdo.myshopify.com/cdn/shop/t/3/assets/dropdown.svg">
                            </div>
                            <div class="bottom">
                                <p class="windowPrice"> ${data_price} <span> USD </span> </p>
                                <p> Quantity </p>
                            </div>
                            <button type="submit"> Add to Cart</button>
                        </div>
                        <div class="productImg">
                            <img src="${data_image}">
                        </div>
                    </div>
                `

      });

    });


    document.querySelector(".viewcard").addEventListener("click", function () {
      window.location.href = "card.html"
    });
  })

  .catch(error => {
    console.error("Error:", error);
  });



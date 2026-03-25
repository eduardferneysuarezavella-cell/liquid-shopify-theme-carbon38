class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  connectedCallback() {
    this.renderRecentlyViewedCarousel();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    if (window.location.href.indexOf("cart=open") > -1) {
      this.open(cartLink);
    }

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    }); 
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');    
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  renderRecentlyViewedCarouselItems(items) {
    console.log("Rendering recently viewed carousel items:", items);
    if (!items || !items.length) return;
    const list = document.querySelector('.rv-products__list');
    const title = document.querySelector('.rv-products__title');
  
    const sectionTitle = "Recently viewed by you";
    const availableItems = [];
  
    const checkAvailability = async (item) => {
      const response = await fetch(`/products/${item.handle}.js`);
      if (response.ok) {
        const product = await response.json();
        if (product.available) {
          availableItems.push(item);
        } else {
          items = items.filter(i => i.handle !== item.handle);
        }
      } else {
        items = items.filter(i => i.handle !== item.handle);
      }
    };
  
    const processItems = async () => {
      await Promise.all(items.map(item => checkAvailability(item)));
  
      if (availableItems.length > 0) {
        if (this.itemCount > 0) {
          list.classList.add('cart-has-products');
        }
  
        list.innerHTML = '';
        title.innerHTML = sectionTitle;
  
        availableItems.forEach((item) => {
          const product = document.createElement('div');
          product.classList.add('rv-products__item', 'swiper-slide');
          product.dataset.productHandle = item.handle;
  
          var isBundle = false;
          if ((item.tags && item.tags.includes('bundle')) || item.title.toLowerCase().includes("bundle")) {
            isBundle = true;
          }
  
          product.innerHTML = `
            <div class="rv-products__item-wrapper" data-is-bundle="${isBundle}">
              <a href="/products/${item.handle}">
                <div class="rv-products__item-img">
                    <img src="${item.featured_image}" alt="${item.title}">
                    <a href="` + (isBundle ? '/products/' + item.handle : '#') + `" class="rv-products__item-quickview ` + (isBundle ? '' : 'quickshop_trigger') + `" data-product-handle="${item.handle}">
                      <div class="rv-products__item-quickview-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.00004 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8.00004 1.33334C4.31814 1.33334 1.33337 4.3181 1.33337 8C1.33337 11.6819 4.31814 14.6667 8.00004 14.6667Z" fill="white" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 5.33334V10.6667" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5.33337 8H10.6667" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"/>
                          <defs>
                          <rect width="16" height="16" fill="white"/>
                          </defs>
                        </svg>
                      </div>
                    </a>
                </div>
                <div class="rv-products__content">
                    <div class="rv-products__item-title">${item.title}</div>
                    <div class="rv-products__item-price">${Shopify.formatMoney(item.price, window.theme.moneyFormat)}</div>
                </div>
              </a>
            </div>
          `;
  
          list.appendChild(product);
        });
  
        let swiperOptions = {
          slidesPerView: 3,
          spaceBetween: 10
        }
  
        if (this.itemCount > 0) {
          swiperOptions = {
            slidesPerView: 4,
            spaceBetween: 8
          }
        }
  
        deferSwiper(function () {
          const rvpSwiper = new Swiper(".rv-products__carousel", {
            ...swiperOptions,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
  
          rvpSwiper.update();
        });
      }
  
      localStorage.setItem('recentlyViewedProductsData', JSON.stringify(items));
    };
  
    processItems();
  }

  renderRecentlyViewedCarousel() {
    if (!document.querySelector(".rv-products__carousel")) return;
    const source = document.querySelector('.rv-products').dataset.source;
    if (source == 'collection') return;
    const _this = this
    
    if(source == "recently-viewed") {
      let items = JSON.parse(localStorage.getItem('recentlyViewedProductsData') || '[]');
      _this.renderRecentlyViewedCarouselItems(items);
    } else if (source == "favorites") {
      const productsToShow = document.querySelector('.rv-products').dataset.productsToShow || 4;
      if(customerLoggedIn) {
        fetch("https://accounts-carbon38-43a19492dfeb.herokuapp.com/get-all-favorites?customerID="+customerLoggedIn+"&limit="+productsToShow, { priority: "low" })
        .then((response) => response.json())
        .then((data) => {
          // Check if we have enough products
          if (!data || data.products.length < 4) {
            return;
          }

          const baseShopUrl = window.location.origin;

          async function fetchAllData() {
            try {
              const fetchPromises = data.products.map(productID =>
                fetch('/api/2022-07/graphql.json', {
                  method: 'POST',
                  headers: {
                    'X-Shopify-Storefront-Access-Token': 'e09aedd0f593820ed2af9f6854af7e2b',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    query: `
                      {
                        product(id: "gid://shopify/Product/${productID}") {
                          handle
                        }
                      }
                      `
                  }),
                })
                .then(res => res.json())
                .then(dataGraphQL => {
                  return {
                    url: `${baseShopUrl}/products/${dataGraphQL.data.product.handle}`
                  }
                })
              );

              const results = await Promise.all(fetchPromises);

              renderProductsFromResults(results, _this);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }

          function renderProductsFromResults(results, where) {
            where.renderRecentlyViewedCarouselItems(results);
          }

          fetchAllData();          
        })
        .catch((error) => {
          console.error("Error fetching top sellers:", error);
          return;
        });
      } else {
        return;
      }
    } else if (source == "top-sellers") {
      const productType = "";
      const baseUrl =
        "https://carbon38-routes-for-flows-8acc05f5a4ae.herokuapp.com/top-sellers";
      const apiUrl = productType
        ? `${baseUrl}/${productType}`
        : baseUrl;

      fetch(apiUrl, { priority: "low" })
        .then((response) => response.json())
        .then((data) => {
          // Check if we have enough products
          if (!data || data.products.length < 4) {
            return;
          }

          const baseShopUrl = window.location.origin;
          const products = data.products.map((product) => ({
            url: `${baseShopUrl}/products/${product.handle}`,
          }));

          _this.renderRecentlyViewedCarouselItems(products);
        })
        .catch((error) => {
          console.error("Error fetching top sellers:", error);
        });
    }
  }

  
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.cart-drawer__header',
      },
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner-empty',
      },
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.cart-drawer__items',
      },
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__footer',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);

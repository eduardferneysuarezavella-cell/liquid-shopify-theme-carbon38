if (!customElements.get("product-feed")) {
  customElements.define("product-feed", class extends HTMLElement {
    constructor() {
      super();

      this.source = this.getAttribute("source");
    }

    connectedCallback() {
      switch (this.source) {
        case "recently-viewed":
          this.renderRecentlyViewed();
          break;
        case "favorites":
          this.renderFavorites();
          break;
        case "you-may-also-like":
          this.renderYouMayAlsoLike();
          break;
        case "top-sellers":
          this.renderTopSellers();
          break;
        default:
          console.warn(`Unknown source: ${this.source}`);
      }
    }

    get productFeedContainer() {
      return this.querySelector("[product-feed-container]");
    }

    renderProducts(products) {
      products.forEach((product, index) => {
        const sliderItem = document.createElement("li");
        sliderItem.classList.add("featured-collection-list__item");
        sliderItem.classList.add("swiper-slide");

        const productFeedItem =
          document.createElement("product-feed-item");
        productFeedItem.setAttribute("product-url", product.url);

        if (index === 0) {
          productFeedItem.setAttribute("is-first", "true");
        }

        if (index === products.length - 1) {
          productFeedItem.setAttribute("is-last", "true");
        }

        sliderItem.appendChild(productFeedItem);
        this.productFeedContainer.appendChild(sliderItem);
        document.documentElement.dispatchEvent(
          new CustomEvent('product-feed:new-product-added', {
            bubbles: true
          })
        );
        
      });


      document.documentElement.dispatchEvent(
        new CustomEvent('product-feed:updated', {
          bubbles: true
        })
      );
    }

    renderFallbackProducts() {
      const productFeedTitle = this.querySelector(
        "[data-product-feed-title]"
      );
      const productFeedTitleMobile = this.querySelector(
        "[data-product-feed-title-mobile]"
      );
      const productFeedSubtitle = this.querySelector(
        "[data-product-feed-subtitle]"
      );
      const productFeedSubtitleMobile = this.querySelector(
        "[data-product-feed-subtitle-mobile]"
      );
      const fallbackTitle = this.getAttribute("fallback-title");
      const fallbackTitleMobile = this.getAttribute("fallback-title-mobile");
      const fallbackSubtitle = this.getAttribute("fallback-subtitle");
      const fallbackSubtitleMobile = this.getAttribute("fallback-subtitle-mobile");

      if (fallbackTitle && productFeedTitle) {
        productFeedTitle.textContent = fallbackTitle;
      }

      if (fallbackTitleMobile && productFeedTitleMobile) {
        productFeedTitleMobile.textContent = fallbackTitleMobile;
      }

      if (fallbackSubtitle && productFeedSubtitle) {
        productFeedSubtitle.textContent = fallbackSubtitle;
      }

      if (fallbackSubtitleMobile && productFeedSubtitleMobile) {
        productFeedSubtitleMobile.textContent = fallbackSubtitleMobile;
      }

      const fallbackProductsTemplate = this.querySelector(
        'template[name="fallback-products"]'
      );
      if (!fallbackProductsTemplate) {
        this.remove();
        return;
      }

      const productSliderItems =
        fallbackProductsTemplate.content.querySelectorAll(
          ".slider__item"
        );

      productSliderItems.forEach((item) => {
        this.productFeedContainer.appendChild(item);
      });

      // Remove skeleton items
      const skeletonItems = this.productFeedContainer.querySelectorAll(
        ".skeleton-item"
      );
      skeletonItems.forEach((item) => item.remove());

    }

    renderTopSellers() {
      // Get product type from data attribute
      const productType = this.getAttribute("product-type") || "";
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
            this.renderFallbackProducts();
            return;
          }

          const baseShopUrl = window.location.origin;
          const products = data.products.map((product) => ({
            url: `${baseShopUrl}/products/${product.handle}`,
          }));

          this.renderProducts(products);
        })
        .catch((error) => {
          console.error("Error fetching top sellers:", error);
          this.renderFallbackProducts();
        });
    }

    renderRecentlyViewed() {
      const recentlyViewedData =
        JSON.parse(
          localStorage.getItem("recentlyViewedProductsHandle")
        ) || [];
      const recentlyViewedProducts =
        recentlyViewedData.filter(Boolean);


      if (!recentlyViewedProducts.length || recentlyViewedProducts.length < 5) {
        this.renderFallbackProducts();
        return;
      }

      const baseUrl = window.location.origin;
      const products = recentlyViewedProducts.map((productHandle) => {
        return {
          url: `${baseUrl}/products/${productHandle}`,
        };
      });

      this.renderProducts(products);
    }

    renderFavorites() {
      if(customerLoggedIn) {
        var thisParent = this;
        fetch("https://accounts-carbon38-43a19492dfeb.herokuapp.com/get-all-favorites?customerID="+customerLoggedIn+"&limit="+this.dataset.productsToShow, { priority: "low" })
        .then((response) => response.json())
        .then((data) => {
          // Check if we have enough products
          if (!data || data.products.length < 5) {
            this.renderFallbackProducts();
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

              renderProductsFromResults(results);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }

          function renderProductsFromResults(results) {
            thisParent.renderProducts(results);
          }

          fetchAllData();          
        })
        .catch((error) => {
          console.error("Error fetching top sellers:", error);
          this.renderFallbackProducts();
        });
      } else {
        this.renderFallbackProducts();
      }
    }

    renderYouMayAlsoLike() {
      fetch(this.dataset.ymalUrl, { priority: "low" })
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const updatedCarouselSlider =
            html.querySelector(".swiper");
          const currentCarouselSlider =
            this.querySelector(".swiper");

          currentCarouselSlider.replaceWith(
            updatedCarouselSlider
          );
        });
    }
  }
  );
}

if (!customElements.get("product-feed-item")) {
  customElements.define(
    "product-feed-item",
    class extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.productUrl = this.getAttribute("product-url");
        this.fetchProductCard(this.productUrl);
      }

      fetchProductCard(url) {
        const sectionUrl = new URL(url);
        sectionUrl.searchParams.set("section_id", "product-card");
        fetch(sectionUrl, { priority: "low" })
          .then((response) => response.text())
          .then((text) => {
            const html = new DOMParser().parseFromString(
              text,
              "text/html"
            );
            const productCard = html.querySelector(".ProductItem");
            if (productCard) {
              this.prepend(productCard);
            }

            // Remove skeleton item
            const carouselSlider = this.closest(".swiper");
            const skeletonItem = carouselSlider.querySelector(
              ".skeleton-item"
            );
            if (skeletonItem) {
              skeletonItem.remove();
            }

            if (this.hasAttribute("is-last")) {
              // Remove skeleton items
              const skeletonItems = carouselSlider.querySelectorAll(
                ".skeleton-item"
              );
              skeletonItems.forEach((item) => item.remove());
            }

            if (!productCard) {
              const sliderItem = this.closest(".slider__item");
              if (sliderItem) {
                sliderItem.remove();
              } else {
                this.remove();
              }
            }
            document.documentElement.dispatchEvent(
              new CustomEvent('product-feed:skeleton-product-removed', {
                bubbles: true
              })
            );
          })
          .catch((e) => {
            console.error(e);
          }).finally(() => {
          });
      }
    }
  );
}
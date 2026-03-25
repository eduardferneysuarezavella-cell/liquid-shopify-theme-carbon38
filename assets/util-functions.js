(function () {
    if(document.querySelector('.header-wrapper').classList.contains('Header--transparent')) {
        document.documentElement.style.setProperty('--header-is-not-transparent', 0);
    } else {
        document.documentElement.style.setProperty('--header-is-not-transparent', 1);
    }

    var windowWidth = window.innerWidth,
        headerSection = document.querySelector('.shopify-section-header-sticky');
        stickySubnav = document.querySelector('.section-sticky-subnav');
    document.documentElement.style.setProperty('--window-height', window.innerHeight + 'px');

    window.addEventListener('resize', function () {
      var newWidth = -1;
      
      if (newWidth === windowWidth) {
        return;
      }

      windowWidth = newWidth;
      document.documentElement.style.setProperty('--window-height', window.innerHeight + 'px');

      if (headerSection) {
        document.documentElement.style.setProperty('--header-height', headerSection.clientHeight + 'px');
      }
        
    });
  })();

  (function () {
    var typingTimer;
    var doneTypingInterval = 1000;
    window.addEventListener('keyup', function (e) {
      if(e.target.name == 'cart-gift-note') {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
      }
    });

    window.addEventListener('keydown', function (e) {
      if(e.target.name == 'cart-gift-note') {
        clearTimeout(typingTimer);
      }
    });

    function doneTyping () {
      fetch("".concat(window.routes.cartUrl, "/update.js"), {
        body: JSON.stringify({
          note: document.querySelector('input[name="cart-gift-note"]').value
        }),
        casdredentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
    }

    window.addEventListener('click', function(e) {
      if(e.target.classList.contains('.cart-gift-trigger-left') || e.target.closest('.cart-gift-trigger-left')) {
        e.preventDefault();

        document.querySelector('.cart-gift-trigger').classList.toggle('checked');
        if(document.querySelector('.cart-gift-trigger').classList.contains('checked')) {
          var formData = {
            'items': []
          };
          var itemData = {
            'id': e.target.closest('.cart-gift').dataset.variantId,
            'quantity': 1,
            'properties': {
              _is_gift_wrap: true
            }
          }
          formData.items.push(itemData);
    
          fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            return response.json();
          })
          .then(data => {
            fetch("".concat(window.routes.cartUrl, "/update.js"), {
              body: JSON.stringify({
                attributes: {
                  'Is Gift': 'Yes'
                },
                note: document.querySelector('input[name="cart-gift-note"]').value
              }),
              credentials: 'same-origin',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response2 => {
              return response2.json();
            })
            .then(data2 => {
              document.querySelector('.cart-gift').classList.add('added');
              document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
            }).catch((error2) => {
              console.error('Error:', error2);
            });
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        } else {
          fetch("".concat(window.routes.cartUrl, "/update.js"), {
            body: JSON.stringify({
              attributes: {
                'Is Gift': ''
              },
              note: ''
            }),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          .then(response => {
            return response.json();
          })
          .then(data => {
            if(data.item_count) {
              data.items.forEach(item => {
                if(document.querySelector('.cart-gift.added') && item.id == document.querySelector('.cart-gift').dataset.variantId) {
                  fetch("".concat(window.routes.cartUrl, "/change.js"), {
                    body: JSON.stringify({
                      id: item.key,
                      quantity: 0
                    }),
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Requested-With': 'XMLHttpRequest'
                    }
                  }).then(response => {
                    return response.json();
                  })
                  .then(data => {
                    document.querySelector('.cart-gift').classList.remove('added');
                    document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
                }
              });
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }          
      }
    });
  })();

  (function () {
    function handleFirstTab(event) {
      if (event.keyCode === 9) {
        document.body.classList.add('is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }

    window.addEventListener('keydown', handleFirstTab);
  })();
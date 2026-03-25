// GAMMAWAVES CUSTOMER ACCOUNTS
const GWCA = Object.freeze({
  MAP: {
    '#my-account': 'dashboard',
    '#my-orders': 'orders',
    '#my-profile': 'profile',
    '#my-favorites': 'dashboard##favorites',
  },

  STORAGE_KEYS: {
    TOKEN: 'i-shsgi--u0mihh3co1e3y9sns',
    EMAIL: 'gw-customer-accounts-email',
    RECENTLY_VIEWED: 'gw-recently-viewed',
    RECENTLY_VIEWED_COLLECTION: 'gw-recently-viewed-collection',
    LOYALTY_POINTS: 'gw-loyalty-points',
    YOTPO_POINTS: 'gw-yotpo-points',
    WISHLIST_PRODUCT_IDS: 'gw-wishlist-product-ids',
    RISE_POINTS: 'gw-rise-points',
    REDIRECT_URL: 'gw-customer-accounts-login-redirect',
    TEMP_WISHLIST_PRODUCTS: 'gw-temp-wishlist-products',
    TEMP_CART_PRODUCTS: 'gw-temp-cart-products',
    TEMP_RECENTLY_VIEWED_ITEMS: 'gw-temp-recently-viewed-items',
  },

  ENDPOINTS: {
    AUTH: {
      SIGN_IN: '/email-sign',
      VERIFY_CODE: '/code-sign',
      GET_TOKEN: '/logged-sign',
      CUSTOMER_LOGGED: '/customer-logged',
    },
    FAVORITES: {
      GET_ALL_IDS: '/get-all-favorites',
      GET: '/get-favorites',
      ADD: '/add-favorite',
      REMOVE: '/remove-favorite',
      ADD_BULK: '/add-favorites',
    },
    VIEWED_PRODUCTS: {
      GET: '/get-viewed-products',
      ADD: '/add-viewed-product',
      ADD_BULK: '/add-viewed-products',
    },
    CART: {
      GET: '/get-cart-products',
      ADD: '/add-cart-product',
      ADD_BULK: '/add-cart-products',
      REMOVE: '/remove-cart',
    },
    ADDRESS: {
      ADD: '/add-address',
      EDIT: '/edit-address',
      REMOVE: '/remove-address',
    },
    CUSTOMER: {
      UPDATE: '/update-customer',
    },
    LOYALTY: {
      GET_LL: '/get-ll-customer',
      GET_YOTPO_CUSTOMER: '/get-youtpo-customer',
      GET_RISE_CREDIT: '/get-rise-customer',
    },
    MISC: {
      GET_MALOMO_ORDER: '/get-malomo-order',
    },
  },

  TAGS_TO_HIDE: ['accounts:hidden'],

  TEMPLATE_IDS: {
    PRODUCT_CARD: 'gw-standard-product-card-template',
    FORM_PRODUCT_CARD: 'gw-form-product-card-template',
  },

  CUSTOM_EVENTS: {
    FAVORITES_STORAGE_UPDATED: 'gw:favorites-storage-updated',
    SAVED_ITEMS_FROM_CART: 'gw:saved-items-from-cart',
    CUSTOMER_ACCOUNT_LOADED: 'gw:customer-account-loaded',
  },

  DRAWER_IDS: {
    favorites: '#Drawer-Favorites',
  },
})

/**
 * Utility class for handling requests, notifications, and other utility functions related to customer accounts.
 */
class GWCustomerAccountsUtils {
  constructor() {}

  /**
   * Returns the component data from the component's shadow DOM.
   * @returns {Object} - The component data.
   */
  get componentData() {
    const gwCustomerAccounts = document.querySelector('gw-customer-accounts')
    const componentDataTag = gwCustomerAccounts.shadowRoot.querySelector(
      '[data-component-data]'
    )
    return JSON.parse(componentDataTag.textContent)
  }

  /**
   * Returns the customer's ID from the component data.
   * @returns {string} - The customer's ID.
   */
  get customerId() {
    return this.componentData?.customer?.id
  }

  /**
   * Returns the customer's first name from the component data.
   * @returns {string} - The customer's first name.
   */
  get customerFirstName() {
    return this.componentData?.customer?.firstName
  }

  /**
   * Returns the customer's email address from local storage.
   * @returns {string} - The customer's email address.
   */
  get customerEmail() {
    return localStorage.getItem(GWCA.STORAGE_KEYS.EMAIL)
  }

  /**
   * Returns true if the customer has a customer ID.
   * @returns {string} - The customer's ID.
   */
  get hasCustomer() {
    return !!this.componentData?.customer?.id
  }

  /**
   * Returns the customer's token from local storage.
   * @returns {string} - The customer's token.
   */
  get customerToken() {
    return localStorage.getItem(GWCA.STORAGE_KEYS.TOKEN)
  }

  /**
   * Returns the base URL from the component data.
   * @returns {string} - The base URL.
   */
  get baseURL() {
    return this.componentData.baseUrl
  }

  /**
   * Returns the app element.
   * @returns {Element} - The app element.
   */
  get app() {
    return document.querySelector('gw-customer-accounts')
  }

  /**
   * Returns the shadow DOM of the app.
   * @returns {ShadowRoot} - The shadow DOM of the app.
   */
  get appShadow() {
    return this.app.shadowRoot
  }

  /**
   * Returns the dashboard web component.
   * @returns {Element} - The dashboard web component.
   */
  get dashboard() {
    return this.appShadow.querySelector('gw-customer-accounts-dashboard')
  }

  /**
   * Returns the tab ID based on the current URL hash.
   * @returns {string} - The tab ID.
   */
  get tabId() {
    return GWCA.MAP[window.location.hash] || 'dashboard'
  }

  /**
   * Makes an HTTP request to the specified URL with the given body and method.
   *
   * @param {string} url - The endpoint URL to send the request to.
   * @param {Object} body - The request payload.
   * @param {string} [method='POST'] - The HTTP method to use (GET or POST).
   * @returns {Promise<Object>} - The response data as a JSON object.
   */
  async request(url, body = {}, method = 'POST') {
    const requestConfig = () => {
      const config = {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (method === 'POST') {
        config.body = JSON.stringify(body)
      }

      return config
    }

    if (method === 'GET') {
      const params = new URLSearchParams(body)
      url = `${url}?${params}`
    }

    if (method === 'POST') {
      body.token = this.customerToken
      body.email = this.customerEmail
      body.customerID = this.customerId
    }

    const response = await fetch(this.baseURL + url, requestConfig())

    return await response.json()
  }

  /**
   * Displays a notification message.
   * @param {string} message - The message to display.
   * @param {string} [variant='primary'] - The variant of the notification (e.g., 'primary', 'success', 'danger').
   * @param {number} [duration=3000] - The duration the notification should be displayed (in milliseconds).
   * @returns {Promise<void>} - A promise that resolves when the notification is displayed.
   */
  notify(message, variant = 'success', duration = 3000) {
    const gwCustomerAccounts = document.querySelector('gw-customer-accounts')
    const notificationAlert = gwCustomerAccounts.shadowRoot.querySelector(
      '[data-notification-alert]'
    )
    const notificationMessage = gwCustomerAccounts.shadowRoot.querySelector(
      '[data-notification-message]'
    )

    notificationMessage.innerHTML = message
    notificationAlert.open = true
  }

  /**
   * Updates the content of the app with the specified elements.
   * Fetches the content using Section Rendering API.
   * @param {Array} elementsToUpdate - The elements to update.
   * @returns {Promise<void>} - A promise that resolves when the content is updated.
   * @async
   */
  async updateAjaxContent(elementsToUpdate) {
    return await this.app.updateContent(elementsToUpdate)
  }

  /**
   * Parses a Shopify variant/product ID to extract the numeric ID at the end.
   * @param {string} id - The Shopify product/variant ID.
   * @returns {string} The parsed ID.
   */
  parseVariantId(id) {
    return String(id).split('/').pop()
  }

  /**
   * Converts cents to dollars and formats the amount.
   * @param {number} amount - The amount in cents.
   */
  formatMoney(amount) {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  /**
   * Adds values to the storage with the specified key.
   * @param {string} key - The key to update.
   * @param {Array} values - The values to add.
   * @param {string} [storageType='local'] - The type of storage to update (local or session).
   * @param {position} [position='start'] - The position to add the values (start or end).
   * @returns {void}
   */
  addToStorage({ key, values, storageType = 'local', position = 'start' }) {
    const storage = storageType === 'local' ? localStorage : sessionStorage
    const currentValue = JSON.parse(storage.getItem(key)) || []

    if (position === 'start') {
      storage.setItem(key, JSON.stringify([...values, ...currentValue]))
    } else {
      storage.setItem(key, JSON.stringify([...currentValue, ...values]))
    }
  }

  /**
   * Removes a value from the storage with the specified key.
   * @param {string} key - The key to update.
   * @param {Array} values - The values to remove.
   * @param {string} [storageType='local'] - The type of storage to update (local or session).
   * @param {string} [nestedKey] - The nested key to remove.
   * @returns {void}
   */
  removeFromStorage({ key, values, storageType = 'local', nestedKey }) {
    const storage = storageType === 'local' ? localStorage : sessionStorage
    const currentValue = JSON.parse(storage.getItem(key)) || []

    if (nestedKey) {
      const updatedValue = currentValue.map((item) => {
        if (values.includes(item[nestedKey])) {
          return null
        }

        return item
      })
      storage.setItem(key, JSON.stringify(updatedValue.filter(Boolean)))
    } else {
      const updatedValue = currentValue.filter((item) => !values.includes(item))
      storage.setItem(key, JSON.stringify(updatedValue))
    }
  }
}

const GWUtils = new GWCustomerAccountsUtils()

customElements.define(
  'gw-customer-accounts',
  class GWCustomerAccounts extends HTMLElement {
    constructor() {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })

      const template = document.getElementById('gw-customer-accounts-template')
      this.shadow.appendChild(template.content.cloneNode(true))
      template.remove()

      this.drawer = this.shadowRoot.querySelector('sl-drawer')
      this.tabGroup = this.shadowRoot.querySelector('sl-tab-group')
      this.closeButtons = this.drawer.querySelectorAll(
        '[data-main-drawer-close]'
      )
    }

    connectedCallback() {
      this._checkCustomerStatus()
      this._watchSavedItemsFromCart()

      if (GWUtils.hasCustomer) {
        this._saveTempWishlistProducts()
        this._saveTempCartProducts()
        this._saveTempRecentlyViewedProducts()
      }

      // Wait for custom elements to be defined before initializing
      Promise.all([
        customElements.whenDefined('sl-drawer'),
        customElements.whenDefined('sl-tab-group'),
        customElements.whenDefined('sl-tab-panel'),
        customElements.whenDefined('sl-tab'),
      ]).then(() => this.init())
    }

    init() {
      // Show the drawer
      this.drawer.removeAttribute('hidden')

      // On page load, if the URL contains a hash, open the drawer
      if (
        window.location.search.includes('my-account-open') &&
        !window.location.pathname.includes('/account')
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )

        window.location.hash = '#my-account'
      }

      // Listen for hash changes
      window.addEventListener('hashchange', () => {
        this._handleHashChange()

        // Reinitialize carousels
        this.reinitializeCarousels()
      })

      // Handle initial hash
      this._handleHashChange()

      // Listen for close button clicks
      this.closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this._closeDrawer()
        })
      })

      // Listen for drawer hide event and update hash
      this.drawer.addEventListener('sl-hide', (event) => {
        if (event.target !== this.drawer) return

        window.location.hash = ''
      })

      this._updateAccountLinks()
      this._handleInputElements()

      this._addRecentlyViewedProducts()
      if (GWUtils.hasCustomer) {
        this._updateRecentlyViewedCollection()
      }

      // Reinitialize carousels after a delay
      this.reinitializeCarousels()

      // Listen for clicks on drawer blocks to open inner drawers
      this.shadowRoot.addEventListener('click', (event) => {
        if (!event.target.closest('[data-drawer-id]')) return

        const drawerId = event.target
          .closest('[data-drawer-id]')
          .getAttribute('data-drawer-id')
        // drawerId = latest-order-drawer
        const drawer = this.shadowRoot.querySelector(`#${drawerId}`)
        // querySelector('#latest-order-drawer')

        if (drawer.hasAttribute('empty')) return

        drawer.open = true

        if (navigator.userAgent.indexOf('iPhone') > -1) {
          setTimeout(() => {
            this.drawer.classList.add('inner-drawer-open')
          }, 150)
        }
      })

      this.shadowRoot.addEventListener('click', (event) => {
        if (!event.target.closest('[data-inner-drawer-close]')) return

        event.target.closest('sl-drawer').open = false

        if (navigator.userAgent.indexOf('iPhone') > -1) {
          this.drawer.classList.remove('inner-drawer-open')
        }
      })

      // If customer is logged in, initialize the wishlist
      if (GWUtils.hasCustomer) {
        this.updateFavoriteItemsStorage()
      }
    }

    /**
     * Reinitializes carousels to update their attributes.
     * @returns {void}
     * @private
     */
    reinitializeCarousels() {
      // Reinitalize carousels, because I changed the way they are rendered,
      // and updated the view per page items using CSS. Doing this to reinitialize the carousels attributes
      // like aria-hidden, active, etc.
      Promise.all([
        customElements.whenDefined('sl-carousel'),
        customElements.whenDefined('sl-carousel-item'),
      ]).then(() => {
        setTimeout(() => {
          this.shadowRoot
            .querySelectorAll('sl-carousel')
            .forEach((carousel) => {
              carousel.initializeSlides()
            })
        }, 1000)
      })
    }

    /**
     * Updates all account links to point to the drawer.
     * @returns {void}
     * @private
     */
    _updateAccountLinks() {
      const links = document.querySelectorAll('a[href]')

      const accountLinks = Array.from(links).filter(
        (link) =>
          link.getAttribute('href').startsWith('/account') ||
          link.getAttribute('href').startsWith('#status')
      )

      accountLinks.forEach((link) => {
        if (link.hasAttribute('data-ignore-account-link')) return

        if (link.getAttribute('href').includes('logout')) {
          link.href = '#my-profile'
        } else {
          link.href = '#my-account'
        }

        // If in design mode, add click event to open drawer
        if (Shopify.designMode) {
          link.addEventListener('click', () => {
            this._openDrawer()
          })
        }
      })
    }

    /**
     * Handles input elements by adding focus and empty classes.
     * @private
     * @returns {void}
     */
    _handleInputElements() {
      // I am adding the focus and empty classes to the input elements
      // so that I can style them accordingly in the CSS
      // This is a workaround because the input components of shoelace
      // do not provide label inside the input field and transition effect on focus
      const handleInputValue = (input) => {
        if (!input.value && !input.getAttribute('value')) {
          input.classList.add('input--empty')
        } else {
          input.classList.remove('input--empty')
        }
      }

      const handleInputFocus = (input) => {
        input.classList.add('input--focus')
      }

      const handleInputBlur = (input) => {
        input.classList.remove('input--focus')
      }

      this.shadowRoot.querySelectorAll('sl-input').forEach((input) => {
        input.addEventListener('sl-input', () => handleInputValue(input))
        input.addEventListener('sl-focus', () => handleInputFocus(input))
        input.addEventListener('sl-blur', () => handleInputBlur(input))

        handleInputValue(input)
      })
    }

    /**
     * Handles hash changes by rendering the appropriate tab.
     */
    _handleHashChange() {
      const hash = window.location.hash

      // If hash is not in the map, return
      if (!GWCA.MAP[hash]) return

      // If hash is in the map, render the tab
      if (GWCA.MAP[hash].includes('##')) {
        const [tab, subTab] = GWCA.MAP[hash].split('##')
        this._renderTab(tab)

        // Artificial delay to render the sub-tab
        setTimeout(() => {
          this._renderSubTab(subTab)
          this._openDrawer()
        }, 100)

        return
      } else {
        // Close any open sub-tabs
        this.shadowRoot.querySelectorAll('sl-drawer').forEach((drawer) => {
          drawer.open = false
        })
      }

      this._renderTab()
      this._openDrawer()
    }

    /**
     * Opens the drawer.
     */
    _openDrawer() {
      if (this.drawer.open) return
      this.drawer.show()
    }

    /**
     * Closes the drawer.
     */
    _closeDrawer() {
      if (!this.drawer.open) return

      this.drawer.hide()
    }

    /**
     * Adds a product to the customer's recently viewed products list.
     * This method is called when a customer views a product page.
     */
    async _addRecentlyViewedProducts() {
      const isProductPage = window.location.pathname.includes('/products/')
      if (!isProductPage) return

      const { product } = GWUtils.componentData
      if (!product) return

      const { id: prodID } = product

      if (GWUtils.hasCustomer) {
        try {
          const response = await GWUtils.request(
            GWCA.ENDPOINTS.VIEWED_PRODUCTS.ADD,
            {
              prodID,
            }
          )

          if (response.error) {
            throw new Error(response.error)
          }

          return response
        } catch (error) {
          console.error(error)
        }
      } else {
        const currentRecentlyViewed = JSON.parse(
          localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_RECENTLY_VIEWED_ITEMS) ||
            '[]'
        )
        if (currentRecentlyViewed.some((p) => p.id === prodID)) return

        GWUtils.addToStorage({
          key: GWCA.STORAGE_KEYS.TEMP_RECENTLY_VIEWED_ITEMS,
          values: [{ ...product }],
        })
      }
    }

    /**
     * Adds a collection to the customer's recently viewed collections list.
     * This method is called when a customer views a collection page.
     */
    _updateRecentlyViewedCollection() {
      const isCollectionPage =
        window.location.pathname.includes('/collections/')
      if (!isCollectionPage) return

      const { collection } = GWUtils.componentData
      if (!collection) return

      const { url: collectionURL, title: collectionTitle } = collection

      const recentlyViewedCollectionStorage = localStorage.getItem(
        GWCA.STORAGE_KEYS.RECENTLY_VIEWED_COLLECTION
      )
      const storedRecentlyViewedCollection =
        JSON.parse(recentlyViewedCollectionStorage) || []

      const uniqueRecentlyViewedCollection =
        storedRecentlyViewedCollection.filter(
          (collection) => collection.url !== collectionURL
        )

      const updatedRecentlyViewedCollection = [
        { url: collectionURL, title: collectionTitle },
        ...uniqueRecentlyViewedCollection,
      ]

      localStorage.setItem(
        GWCA.STORAGE_KEYS.RECENTLY_VIEWED_COLLECTION,
        JSON.stringify(updatedRecentlyViewedCollection)
      )
    }

    /**
     * Renders the specified tab.
     */
    _renderTab(tabId) {
      this.tabGroup.show(tabId || GWUtils.tabId)
    }

    /**
     * Renders the specified sub-tab.
     * @param {string} subTab - The sub-tab to render.
     */
    _renderSubTab(subTab) {
      const drawerId = GWCA.DRAWER_IDS[subTab]
      if (!drawerId) return

      const drawer = this.shadowRoot.querySelector(drawerId)
      if (!drawer) return

      drawer.open = true
    }

    /**
     * Updates the drawer content with the specified section ID.
     * @param {Array} elementsToUpdate - The elements to update.
     * @returns {void}
     */
    async updateContent(elementsToUpdate = []) {
      const sectionId = this.getAttribute('data-section-id')
      const updatedContent = await this._fetchContent(sectionId)

      elementsToUpdate.forEach((element) => {
        const targetElement = this.shadow.querySelector(element)

        if (targetElement) {
          const updatedGwCustomerAccountsTemplateContent =
            updatedContent.querySelector(
              '#gw-customer-accounts-template'
            ).content

          const updatedElement =
            updatedGwCustomerAccountsTemplateContent.querySelector(element)
          targetElement.innerHTML = updatedElement.innerHTML
        }
      })
    }

    /**
     * Fetches the content for the specified section ID.
     * @param {string} sectionId - The section ID to fetch content for.
     * @returns {Promise<Document>} - The parsed HTML content.
     */
    async _fetchContent(sectionId) {
      const response = await fetch(
        window.location.pathname + `?section_id=${sectionId}`
      )

      const html = await response.text()
      const parsedHtml = new DOMParser().parseFromString(html, 'text/html')

      return parsedHtml
    }

    /**
     * Updates the wishlist items in the local storage.
     * @param {Object} props - The properties to update.
     * @param {Array} props.removeIds - The IDs to remove from the wishlist.
     * @param {Array} props.addIds - The IDs to add to the wishlist.
     * @returns {void}
     * @async
     */
    async updateFavoriteItemsStorage(props) {
      const { removeIds, addIds } = props || {}
      let preventFetch = false

      // If add IDs are passed, add them to the wishlist
      if (addIds?.length) {
        GWUtils.addToStorage({
          key: GWCA.STORAGE_KEYS.WISHLIST_PRODUCT_IDS,
          values: addIds,
          storageType: 'session',
        })
        preventFetch = true
      }

      // If remove IDs are passed, remove them from the wishlist
      if (removeIds?.length) {
        GWUtils.removeFromStorage({
          key: GWCA.STORAGE_KEYS.WISHLIST_PRODUCT_IDS,
          values: removeIds,
          storageType: 'session',
        })
        preventFetch = true
      }

      if (preventFetch) {
        this.dispatchEvent(
          new CustomEvent(GWCA.CUSTOM_EVENTS.FAVORITES_STORAGE_UPDATED)
        )

        return
      }

      try {
        const response = await GWUtils.request(
          GWCA.ENDPOINTS.FAVORITES.GET_ALL_IDS,
          {
            customerID: GWUtils.customerId,
          },
          'GET'
        )

        if (response.error) {
          throw new Error(response.error)
        }

        sessionStorage.setItem(
          GWCA.STORAGE_KEYS.WISHLIST_PRODUCT_IDS,
          JSON.stringify(response.products)
        )

        this.dispatchEvent(
          new CustomEvent(GWCA.CUSTOM_EVENTS.FAVORITES_STORAGE_UPDATED)
        )
      } catch (error) {
        console.error('Error initializing wishlist:', error)
      }
    }

    /**
     * Checks the customer's status and updates the customer token if necessary.
     * @returns {void}
     * @async
     */
    async _checkCustomerStatus() {
      const customerToken = GWUtils.customerToken
      const { id_sha256, email, tags, id } = GWUtils.componentData.customer

      // Gettings customer email from component data instead of local storage

      /**
        If customer is logged in with Status or standard Shopify login form
        there will not be a token in the local storage to do POST requests
        to the API. So, we need to get the token from the API and store it
      */
      if (!customerToken && id) {
        try {
          const response = await GWUtils.request(
            GWCA.ENDPOINTS.AUTH.GET_TOKEN,
            { customerEmail: email, encode: id_sha256 },
            'POST'
          )

          if (response.error) {
            throw new Error(response.error)
          }

          if (response.token) {
            localStorage.setItem(GWCA.STORAGE_KEYS.TOKEN, response.token)
            localStorage.setItem(GWCA.STORAGE_KEYS.EMAIL, email)
          }

          this.dispatchEvent(new CustomEvent(GWCA.CUSTOM_EVENTS.CUSTOMER_ACCOUNT_LOADED))
        } catch (error) {
          console.error('Error checking customer status:', error)
        }
      }

      /**
        Check if logged in customer has "gw-customer" tag
        If not, add the tag to the customer
      */
      if (tags && !tags.includes('gw-customer')) {
        try {
          const response = await GWUtils.request(
            GWCA.ENDPOINTS.AUTH.CUSTOMER_LOGGED,
            {}
          )

          if (response.error) {
            throw new Error(response.error)
          }
        } catch (error) {
          console.error('Error checking customer status:', error)
        }
      }
    }

    /**
     * Saves the temporary wishlist products from local storage to the customer's account.
     * @returns {void}
     */
    async _saveTempWishlistProducts() {
      const tempWishlistProducts = JSON.parse(
        localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS)
      )

      if (!tempWishlistProducts?.length) return

      const payload = {
        products: tempWishlistProducts.map((product) => {
          const { id, variantId } = product
          return { prodID: id, varID: variantId }
        }),
      }

      try {
        const response = await GWUtils.request(
          GWCA.ENDPOINTS.FAVORITES.ADD_BULK,
          payload
        )

        if (response.error) {
          throw new Error(response.error)
        }

        localStorage.removeItem(GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS)

        if (response.products?.length) {
          sessionStorage.setItem(
            GWCA.STORAGE_KEYS.WISHLIST_PRODUCT_IDS,
            JSON.stringify(response.products)
          )

          this.dispatchEvent(
            new CustomEvent(GWCA.CUSTOM_EVENTS.FAVORITES_STORAGE_UPDATED)
          )
        }

        GWUtils.dashboard.loadFavoriteItems()
      } catch (error) {
        console.error('Error saving temp wishlist products:', error)
      }
    }

    /**
     * Saves the temporary cart products from local storage to the customer's account.
     * @returns {void}
     */
    async _saveTempCartProducts() {
      const tempCartProducts = JSON.parse(
        localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS)
      )

      if (!tempCartProducts?.length) return

      const payload = {
        products: tempCartProducts.map((product) => {
          const { id, variantId } = product
          return { prodID: id, varID: variantId }
        }),
      }

      try {
        const response = await GWUtils.request(
          GWCA.ENDPOINTS.CART.ADD_BULK,
          payload
        )

        if (response.error) {
          throw new Error(response.error)
        }

        localStorage.removeItem(GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS)

        GWUtils.dashboard.loadSavedCartItems()
      } catch (error) {
        console.error('Error saving temp cart products:', error)
      }
    }

    /**
     * Saves the temporary recently viewed products from local storage to the customer's account.
     * @returns {void}
     */
    async _saveTempRecentlyViewedProducts() {
      const tempRecentlyViewedProducts = JSON.parse(
        localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_RECENTLY_VIEWED_ITEMS)
      )

      if (!tempRecentlyViewedProducts?.length) return

      const payload = {
        products: tempRecentlyViewedProducts.map((product) => {
          const { id } = product
          return { prodID: id }
        }),
      }

      try {
        const response = await GWUtils.request(
          GWCA.ENDPOINTS.VIEWED_PRODUCTS.ADD_BULK,
          payload
        )

        if (response.error) {
          throw new Error(response.error)
        }

        localStorage.removeItem(GWCA.STORAGE_KEYS.TEMP_RECENTLY_VIEWED_ITEMS)

        console.log('Saved temp recently viewed products:', response)

        GWUtils.dashboard.loadRecentlyViewedItems()
      } catch (error) {
        console.error('Error saving temp recently viewed products:', error)
      }
    }

    async _watchSavedItemsFromCart() {
      // Attach an event listener to handle individual “add to cart” events
      this.addEventListener(
        GWCA.CUSTOM_EVENTS.SAVED_ITEMS_FROM_CART,
        async (event) => {
          if (!GWUtils.hasCustomer) {
            this._handleGuestCartEvent(event)
          } else {
            await this._handleAuthedCartEvent(event)
          }
        }
      )
    }

    /**
     * Handles the “add to cart” event for guests (not logged in).
     * @param {Event} event
     * @private
     */
    _handleGuestCartEvent(event) {
      let productData = GWUtils?.componentData?.product || {}
      // If there's no product ID, try to get it from the product card
      if (!productData.id) {
        let productCard = event.detail?.target?.closest(
          '[data-gw-product-card-selector]'
        )
        if (!productCard) {
          productCard = event.detail?.target?.closest('.gw-product-card')
        }

        // Get product data from wishlist button as it already contains the product data
        const wishlistButton = productCard.querySelector('gw-wishlist-button')
        const productDataElement = wishlistButton.querySelector(
          '[data-product-data]'
        )
        const parsedProductData = JSON.parse(productDataElement.textContent)
        if (!parsedProductData.id) return
        productData = parsedProductData
      }

      const storedData =
        JSON.parse(
          localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS)
        ) || []

      const filtered = storedData.filter((p) => p.id !== productData.id)
      const updated = [productData, ...filtered]

      localStorage.setItem(
        GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS,
        JSON.stringify(updated)
      )

      GWUtils.dashboard.loadSavedCartItems()
    }

    /**
     * Handles the “add to cart” event for logged-in users.
     * @param {Event} event
     * @private
     */
    async _handleAuthedCartEvent(event) {
      try {
        const { productId, variantId } = event.detail || {}
        if (!productId || !variantId) return

        const response = await GWUtils.request(GWCA.ENDPOINTS.CART.ADD, {
          prodID: productId,
          varID: variantId,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        GWUtils.dashboard.loadSavedCartItems()
      } catch (error) {
        console.error('Error adding product to cart:', error)
      }
    }
  }
)

class GWCustomerAccountsTab extends HTMLElement {
  constructor() {
    super()
    this.tabData = this._parseTabData()
    this.tabId = this.tabData?.id
    this.tabGroup = this.closest('sl-tab-group')
    this.tabPanel = this.closest('sl-tab-panel')
    this.mainDrawerLabel = GWUtils.appShadow.querySelector(
      '[data-main-drawer-label]'
    )
  }

  connectedCallback() {
    // Add Fade In Animations
    this._addAnimations()

    // Listen for tab show event
    this.tabGroup.addEventListener('sl-tab-show', (event) => {
      if (event.detail.name === this.tabId) {
        this._playFadeInAnimations()
        this._updateMainDrawerLabel()
        this._updateSignInBlockHeading()
        this._updateHash()

        GWUtils.app.reinitializeCarousels()
      } else {
        this._resetAnimations()
      }
    })

    // Initial Fade In Animations if tab is active on load
    // If the hash is not in the map, prevent animations from playing
    if (!GWCA.MAP[window.location.hash]) return

    const isCurrentTab = window.location.hash === this.tabId
    const isSubTabOpenInCurrentTab = GWCA.MAP[window.location.hash].includes(
      this.tabId
    )

    if (isCurrentTab || isSubTabOpenInCurrentTab) {
      this._playFadeInAnimations()
    }
  }

  /**
   * Returns all animation elements in the tab panel.
   * @returns {Array} - The animation elements.
   * @readonly
   */
  get animationElements() {
    const animationElements = this.querySelectorAll('sl-animation')
    const allAnimationElements = [...animationElements]

    const signInBlockAnimationElement = GWUtils.appShadow.querySelector(
      '[gw-sign-in-block-animation]'
    )
    if (signInBlockAnimationElement) {
      allAnimationElements.unshift(signInBlockAnimationElement)
    }

    return allAnimationElements
  }

  /**
   * Parses the tab data which is a JSON string in script tag.
   * @returns {Object} - The parsed tab data.
   */
  _parseTabData() {
    const tabData = this.querySelector('[data-tab-panel-data]')

    if (tabData) {
      return JSON.parse(tabData.textContent)
    }

    return {}
  }

  /**
   * Updates the hash in the URL to match the tab's hash.
   * @returns {void}
   */
  _updateHash() {
    // If the tab has a sub-tab, do not update the hash
    const hash = window.location.hash
    const hasSubTab = GWCA.MAP[hash]?.includes('##')
    if (hasSubTab) return

    window.location.hash = this.tabData?.hash
  }

  /**
   * Updates the main drawer label with the tab's title.
   * @returns {void}
   */
  _updateMainDrawerLabel() {
    const tabTitle = this.tabData?.label

    if (tabTitle && this.mainDrawerLabel) {
      this.mainDrawerLabel.textContent = tabTitle
    }
  }

  /**
   * Updates the sign-in block heading with the tab's sign-in block heading.
   * @returns {void}
   */
  _updateSignInBlockHeading() {
    const signInBlockHeading = this.tabData?.signInBlockHeading
    const $signInBlockHeading = GWUtils.appShadow.querySelector(
      '[data-sign-in-block-heading]'
    )

    if (signInBlockHeading && $signInBlockHeading) {
      $signInBlockHeading.textContent = signInBlockHeading
    }
  }

  /**
   * Plays the fade in animations for the tab panel.
   * @returns {void}
   */
  _playFadeInAnimations() {
    this.animationElements.forEach((element) => (element.play = true))
  }

  /**
   * Adds fade in animations to the tab panel elements.
   * @returns {void}
   */
  _addAnimations() {
    this.animationElements.forEach((element, index) => {
      element.keyframes = [
        {
          offset: 0,
          opacity: '0',
          transform: 'translate3d(0, -10px, 0)',
          easing: 'ease-in-out',
        },
        {
          offset: 1,
          opacity: '1',
          transform: 'translate3d(0, 0, 0)',
          easing: 'ease-in-out',
        },
      ]

      element.delay = index * 80
    })
  }

  /**
   * Resets all animations in the tab panel.
   * @returns {void}
   */
  _resetAnimations() {
    this.animationElements.forEach((element) => {
      if (element.currentTime > 0) {
        element.currentTime = 0
      }
    })
  }
}

customElements.define(
  'gw-customer-accounts-dashboard',
  class GWCustomerAccountsDashboard extends GWCustomerAccountsTab {
    constructor() {
      super()
    }

    connectedCallback() {
      super.connectedCallback()

      this._initDashboard()
    }

    /**
     * Initialize the dashboard by rendering various sections.
     */
    async _initDashboard() {
      if (GWUtils.hasCustomer) {
        this._renderRecentlyViewedCollections()
      }

      this.loadSavedCartItems()
      this.loadFavoriteItems()
      this.loadRecentlyViewedItems()
    }

    async loadRecentlyViewedItems(props = {}) {
      const {
        preventDrawerRender = false,
        preventCarouselRender = false,
        page = 1,
        limit = 8,
      } = props

      try {
        const recentlyViewedItems = await this._getRecentlyViewedItems(
          page,
          limit
        )

        this._renderRecentlyViewedItems(recentlyViewedItems, {
          preventDrawerRender,
          preventCarouselRender,
          page,
          limit,
        })
      } catch (error) {
        console.error('Error rendering recently viewed items:', error)
      }
    }

    /**
     * Gets recently viewed items, either from API (if user is logged in) or from local storage.
     * @param {number} page - Current page for pagination.
     * @param {number} limit - Number of items per page.
     * @returns {Promise<Array>} - Array of recently viewed items.
     */
    async _getRecentlyViewedItems(page, limit) {
      if (!GWUtils.hasCustomer) {
        // Not logged in — get from local storage.
        return (
          JSON.parse(
            localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_RECENTLY_VIEWED_ITEMS)
          ) || []
        )
      }

      // Logged in — fetch from API.
      const response = await GWUtils.request(
        GWCA.ENDPOINTS.VIEWED_PRODUCTS.GET,
        {
          customerID: GWUtils.customerId,
          limit,
          page,
        },
        'GET'
      )

      if (response.error) {
        throw new Error(response.error)
      }

      return response.products || []
    }

    /**
     * Renders the given recently viewed items into the carousel/drawer.
     * @param {Array} items - The recently viewed items to render.
     * @param {Object} props - Additional rendering props.
     * @param {boolean} props.preventDrawerRender - Toggle drawer rendering.
     * @param {boolean} props.preventCarouselRender - Toggle carousel rendering.
     * @param {number} props.page - Current page.
     * @param {number} props.limit - Page limit.
     */
    _renderRecentlyViewedItems(items, props) {
      const recentlyViewedContainerSelector = '[data-recently-viewed-container]'
      const recentlyViewedDrawerContainerSelector =
        '[data-recently-viewed-drawer-container]'

      const recentlyViewedContainer = GWUtils.appShadow.querySelector(
        recentlyViewedContainerSelector
      )
      if (!recentlyViewedContainer) return

      if (!items.length) {
        this._renderEmptyState(
          recentlyViewedContainerSelector,
          recentlyViewedDrawerContainerSelector
        )
        return
      }

      // Render to carousel
      if (!props.preventCarouselRender) {
        this._renderProductsToCarousel(items, recentlyViewedContainerSelector)
      }

      // Render to drawer
      if (!props.preventDrawerRender) {
        this._renderProductsToDrawer({
          products: items,
          containerSelector: recentlyViewedDrawerContainerSelector,
          productTemplateId: GWCA.TEMPLATE_IDS.PRODUCT_CARD,
          currentPage: props.page,
          nextPage: null,
        })
      }
    }

    /**
     * Gets saved cart items, either from API (if user is logged in) or from local storage.
     * @param {number} page - Current page for pagination.
     * @param {number} limit - Number of items per page.
     * @returns {Promise<Array>} - Array of saved cart items.
     */
    async _getSavedCartItems(page, limit) {
      if (!GWUtils.customerId) {
        // Not logged in — get from local storage.
        return (
          JSON.parse(
            localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS)
          ) || []
        )
      }

      // Logged in — fetch from API.
      const response = await GWUtils.request(
        GWCA.ENDPOINTS.CART.GET,
        { customerEmail: GWUtils.customerEmail, limit, page },
        'GET'
      )

      if (response.error) {
        throw new Error(response.error)
      }

      return response.products || []
    }

    /**
     * Renders the given cart items into the carousel/drawer.
     * @param {Array} items - The cart items to render.
     * @param {Object} props - Additional rendering props.
     * @param {boolean} props.preventDrawerRender - Toggle drawer rendering.
     * @param {boolean} props.preventCarouselRender - Toggle carousel rendering.
     * @param {number} props.page - Current page.
     * @param {number} props.limit - Page limit.
     */
    _renderSavedCartItems(items, props) {
      const savedItemsContainerSelector =
        '[data-saved-from-cart-items-container]'
      const savedItemsDrawerContainerSelector =
        '[data-saved-from-cart-drawer-container]'

      const savedItemsContainer = this.querySelector(
        savedItemsContainerSelector
      )
      if (!savedItemsContainer) return

      if (!items.length) {
        this._renderEmptyState(
          savedItemsContainerSelector,
          savedItemsDrawerContainerSelector
        )
        return
      }

      // Calculate next page for pagination
      const nextPage = this._calculateNextPage({
        totalItems: items.length,
        currentPage: props.page,
        limit: props.limit,
      })

      // Render to carousel
      if (!props.preventCarouselRender) {
        this._renderProductsToCarousel(items, savedItemsContainerSelector)
      }

      // Render to drawer
      if (!props.preventDrawerRender) {
        this._renderProductsToDrawer({
          products: items,
          containerSelector: savedItemsDrawerContainerSelector,
          removeButtonAction: 'data-saved-from-cart-remove',
          productTemplateId: GWCA.TEMPLATE_IDS.FORM_PRODUCT_CARD,
          currentPage: props.page,
          nextPage: nextPage,
        })
      }
    }

    /**
     * Main method to fetch & render cart items from API or local storage.
     * @param {Object} [props={}] - Additional rendering props.
     */
    async loadSavedCartItems(props = {}) {
      const {
        preventDrawerRender = false,
        preventCarouselRender = false,
        page = 1,
        limit = 10,
      } = props

      try {
        const savedItems = await this._getSavedCartItems(page, limit)
        this._renderSavedCartItems(savedItems, {
          preventDrawerRender,
          preventCarouselRender,
          page,
          limit,
        })
      } catch (error) {
        console.error('Error rendering saved items from cart:', error)
      }
    }

    /**
     * Retrieves favorite items from either the API (if logged in)
     * or local storage (if not).
     * @param {number} page
     * @param {number} limit
     * @returns {Promise<Array>} favorite items
     */
    async _getFavoriteItems(page, limit) {
      console.log("GET FAVORITES");
      if (!GWUtils.hasCustomer) {
        // Not logged in: local storage
        return (
          JSON.parse(
            localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS)
          ) || []
        )
      }

      // Logged in: API request
      const response = await GWUtils.request(
        GWCA.ENDPOINTS.FAVORITES.GET,
        { limit, page, customerID: GWUtils.customerId },
        'GET'
      )

      if (response.error) {
        throw new Error(response.error)
      }

      return response.products || []
    }

    /**
     * Renders the given items into carousel and drawer
     * @param {Array} favoriteItems
     * @param {Object} props
     */
    _renderFavoriteItems(favoriteItems, props) {
      console.log('Rendering favorite items:', favoriteItems);
      const favoritesContainerSelector = '[data-favorites-container]'
      const favoritesDrawerContainerSelector =
        '[data-favorites-drawer-container]'

      const favoritesContainer = GWUtils.appShadow.querySelector(
        favoritesContainerSelector
      )
      if (!favoritesContainer) return

      if (!favoriteItems.length) {
        this._renderEmptyState(
          favoritesContainerSelector,
          favoritesDrawerContainerSelector
        )
        return
      }

      const {
        preventDrawerRender = false,
        preventCarouselRender = false,
        page = 1,
        limit = 10,
      } = props

      // Carousel
      if (!preventCarouselRender) {
        // Reverse if needed
        this._renderProductsToCarousel(
          favoriteItems,
          favoritesContainerSelector
        )
      }

      // Calculate next page
      const nextPage = this._calculateNextPage({
        totalItems: favoriteItems.length,
        currentPage: page,
        limit: limit,
      })

      // Drawer
      if (!preventDrawerRender) {
        this._renderProductsToDrawer({
          products: favoriteItems,
          containerSelector: favoritesDrawerContainerSelector,
          removeButtonAction: 'data-wishlist-remove',
          productTemplateId: GWCA.TEMPLATE_IDS.FORM_PRODUCT_CARD,
          currentPage: page,
          nextPage: nextPage,
        })
      }
    }

    /**
     * Renders a single favorite item to the carousel and drawer.
     * The diffrence between this and _renderFavoriteItems is that this
     * method only renders a single item and prepends it to the list without
     * re-fetching and re-rendering the entire list.
     * @param {Object} product - The product to render.
     * @returns {void}
     */
    _renderSingleFavoriteItem(product) {
      console.log('Rendering single favorite item:', product)
      const favoritesContainerSelector = '[data-favorites-container]'
      const favoritesDrawerContainerSelector =
        '[data-favorites-drawer-container]'

      // Create a carousel element and prepend it to the carousel container
      const favoritesContainer = GWUtils.appShadow.querySelector(
        favoritesContainerSelector
      )

      const productElementTemplate = document.getElementById(
        GWCA.TEMPLATE_IDS.PRODUCT_CARD
      )
      if (!productElementTemplate) {
        console.warn('Product card template not found.')
        return
      }
      const productElement = productElementTemplate.content.cloneNode(true)
      const carouselElement = this._populateCarouselItem(
        productElement,
        product
      )

      const favoritesCarousel = favoritesContainer.querySelector('sl-carousel')
      if (favoritesCarousel) {
        favoritesCarousel.prepend(carouselElement)
      } else {
        const carousel = document.createElement('sl-carousel')
        carousel.setAttribute('navigation', '')
        carousel.setAttribute('slides-per-page', '3')
        carousel.setAttribute('slides-per-move', '3')
        carousel.setAttribute(
          'style',
          '--scroll-hint: 5%; --aspect-ratio: none'
        )

        carousel.appendChild(carouselElement)
        favoritesContainer.innerHTML = ''
        favoritesContainer.appendChild(carousel)
      }

      // Create a drawer element and prepend it to the drawer container
      const drawerContainer = GWUtils.appShadow.querySelector(
        favoritesDrawerContainerSelector
      )
      if (drawerContainer) {
        const drawerElementTemplate = document.getElementById(
          GWCA.TEMPLATE_IDS.FORM_PRODUCT_CARD
        )
        if (!drawerElementTemplate) {
          console.warn('Drawer product card template not found.')
          return
        }
        const drawerElement = this._createProductElement(
          product,
          drawerElementTemplate,
          'data-wishlist-remove'
        )

        this._ensureDrawerNotEmpty(favoritesContainer)
        drawerContainer.prepend(drawerElement)
      }
    }

    /**
     * Removes a favorite item from the carousel and drawer.
     * @param {number} productId - The ID of the product to remove.
     * @returns {void}
     */
    _removeFavoriteItem(productId) {
      const favoritesContainerSelector = '[data-favorites-container]'
      const favoritesDrawerContainerSelector =
        '[data-favorites-drawer-container]'

      const favoritesContainer = GWUtils.appShadow.querySelector(
        favoritesContainerSelector
      )
      const favoritesDrawerContainer = GWUtils.appShadow.querySelector(
        favoritesDrawerContainerSelector
      )

      if (favoritesContainer) {
        const carouselItem = favoritesContainer.querySelector(
          `[data-product-id="${productId}"]`
        )
        if (carouselItem) carouselItem.remove()

        // If carousel is empty, render empty state
        if (!favoritesContainer.querySelector('sl-carousel-item')) {
          this._renderEmptyState(
            favoritesContainerSelector,
            favoritesDrawerContainerSelector
          )
        }
      }

      if (favoritesDrawerContainer) {
        const drawerItem = favoritesDrawerContainer.querySelector(
          `[data-product-id="${productId}"]`
        )
        if (drawerItem) drawerItem.remove()
      }
    }

    /**
     * Main orchestrator to fetch and render favorite items.
     * @param {Object} [props={}]
     */
    async loadFavoriteItems(props = {}) {
      const { page = 1, limit = 10 } = props

      try {
        const favoriteItems = await this._getFavoriteItems(page, limit)
        this._renderFavoriteItems(favoriteItems, props)
      } catch (error) {
        console.error('Error rendering favorite items:', error)
      }
    }

    /**
     * Renders recently viewed collections as a carousel.
     */
    _renderRecentlyViewedCollections() {
      const storageKey = GWCA.STORAGE_KEYS.RECENTLY_VIEWED_COLLECTION
      const collectionsData = JSON.parse(localStorage.getItem(storageKey)) || []

      const container = this.querySelector(
        '[data-recently-viewed-collections-container]'
      )
      if (!container) return

      container.innerHTML = ''

      if (!collectionsData.length) {
        return
      }

      const carousel = document.createElement('sl-carousel')
      carousel.setAttribute('navigation', '')
      carousel.setAttribute('style', '--scroll-hint: 5%; --aspect-ratio: none')

      collectionsData.forEach((collection) => {
        const item = document.createElement('sl-carousel-item')
        item.innerHTML = `
          <a href="${collection.url}" class="gw-button-text gw-unstyled-link gw-recently-viewed-collection">
            ${collection.title}
          </a>
        `
        carousel.appendChild(item)
      })

      container.appendChild(carousel)
    }

    /**
     * Renders a list of products into a carousel in the specified container.
     * @param {Array} products - The product list to render.
     * @param {string} containerSelector - The CSS selector for the carousel container.
     */
    _renderProductsToCarousel(products, containerSelector) {
      const container = GWUtils.appShadow.querySelector(containerSelector)
      if (!container) return

      container.innerHTML = ''

      this._ensureDrawerNotEmpty(container)

      const carousel = document.createElement('sl-carousel')
      carousel.setAttribute('navigation', '')
      carousel.setAttribute('slides-per-page', '3')
      carousel.setAttribute('slides-per-move', '3')
      carousel.setAttribute('style', '--scroll-hint: 5%; --aspect-ratio: none')

      if (products.length > 3) {
        carousel.setAttribute('data-has-next', '')
      }

      carousel.addEventListener('sl-slide-change', (event) => {
        event.detail.index > 0
          ? carousel.setAttribute('data-has-previous', '')
          : carousel.removeAttribute('data-has-previous')

        event.detail.index + 3 < products.length
          ? carousel.setAttribute('data-has-next', '')
          : carousel.removeAttribute('data-has-next')
      })

      const template = document.getElementById(GWCA.TEMPLATE_IDS.PRODUCT_CARD)
      if (!template) {
        console.warn('Carousel item template not found.')
        return
      }

      products.forEach((product) => {
        if (this._shouldHideProduct(product)) return

        const productElement = template.content.cloneNode(true)
        const carouselElement = this._populateCarouselItem(
          productElement,
          product
        )
        carousel.appendChild(carouselElement)
      })

      container.appendChild(carousel)
    }

    /**
     * Renders products with a quick-add-to-cart form.
     * This method handles both variant and single-variant products.
     * @param {Object} props - Properties for rendering the product list.
     * @param {Array} props.products - The products to render.
     * @param {number} props.currentPage - The current page number.
     * @param {number} props.nextPage - The next page number.
     * @param {string} props.containerSelector - The container's CSS selector.
     * @param {string} props.removeButtonAction - The attribute action for remove buttons.
     * @param {string} props.productTemplateId - The ID of the product template.
     */
    _renderProductsToDrawer({
      products,
      currentPage,
      nextPage,
      containerSelector,
      removeButtonAction,
      productTemplateId,
    }) {
      const container = GWUtils.appShadow.querySelector(containerSelector)
      if (!container) return

      const drawer = container.closest('sl-drawer')
      if (drawer) {
        drawer.removeAttribute('empty')
      }

      // Clear container if rendering the first page
      if (currentPage === 1) {
        container.innerHTML = ''
      }

      // Remove load more button if it exists
      const loadMoreButton = container.querySelector('[data-load-more-button]')
      if (loadMoreButton) loadMoreButton.remove()

      const template = document.getElementById(
        productTemplateId || GWCA.TEMPLATE_IDS.PRODUCT_CARD
      )
      if (!template) {
        console.warn('Product card template not found.')
        return
      }

      products.forEach((product) => {
        if (this._shouldHideProduct(product)) return

        const productElement = this._createProductElement(
          product,
          template,
          removeButtonAction
        )
        container.appendChild(productElement)
      })

      if (nextPage) {
        this._renderLoadMoreButton(container, nextPage)
      }
    }

    /**
     * Renders an empty state message in a container.
     * If a drawer is associated with the container, marks it as empty.
     * @param {string} carouselItemsContainerSelctor - The CSS selector for the carousel container.
     * @param {string} drawerItemsContainerSelector - The CSS selector for the drawer container.
     */
    _renderEmptyState(
      carouselItemsContainerSelctor,
      drawerItemsContainerSelector
    ) {
      const carouselContainer = GWUtils.appShadow.querySelector(
        carouselItemsContainerSelctor
      )
      if (!carouselContainer) return

      const drawerSelector = carouselContainer.getAttribute(
        'data-drawer-selector'
      )
      const emptyStateMessage =
        carouselContainer.getAttribute('data-empty-state-message') ||
        'No items found.'

      if (drawerSelector) {
        const drawer = GWUtils.appShadow.querySelector(`#${drawerSelector}`)

        if (drawer) {
          drawer.setAttribute('empty', '')

          const drawerItemsContainer = drawer.querySelector(
            drawerItemsContainerSelector
          )
          if (drawerItemsContainer) {
            drawerItemsContainer.innerHTML = ''
          }

          if (drawer.hasAttribute('open')) {
            drawer.hide()
          }
        }
      }

      carouselContainer.innerHTML = `
        <div class="gw-empty-list">
          <div class="gw-empty-list-inner">
            <p>${emptyStateMessage}</p>
          </div>
        </div>
      `
    }

    /**
     * Calculates the next page number based on the number of items and the current page.
     * @param {number} totalItems - The number of items in the list.
     * @param {number} currentPage - The current page number.
     * @param {number} limit - The number of items per page.
     * @returns {number} - The next page number.
     */
    _calculateNextPage({ totalItems, currentPage, limit }) {
      const totalPages = Math.ceil(totalItems / limit)
      return currentPage < totalPages ? currentPage + 1 : null
    }

    /**
     * Renders a "Load More" button for the drawer.
     * @param {HTMLElement} container - The container element.
     * @param {number} nextPage - The next page number.
     * @returns {void}
     */
    _renderLoadMoreButton(container, nextPage) {
      const loadMoreButton = document.createElement('button')
      loadMoreButton.textContent = 'Load More'
      loadMoreButton.classList.add('gw-button', 'gw-button--stroke')
      loadMoreButton.setAttribute('data-load-more-button', '')

      const loaderHTML = `
        <span class="gw-loader-container" hidden data-loader>
          <span class="gw-loader"></span>
        </span>
      `

      loadMoreButton.insertAdjacentHTML('beforeend', loaderHTML)

      loadMoreButton.addEventListener('click', () => {
        loadMoreButton.querySelector('[data-loader]').removeAttribute('hidden')

        this.loadFavoriteItems({
          preventCarouselRender: true,
          page: nextPage,
        })
      })

      container.appendChild(loadMoreButton)
    }

    /**
     * Determines if a product should be hidden based on its tags.
     * @param {Object} product - The product object.
     * @returns {boolean} True if product should be hidden, otherwise false.
     */
    _shouldHideProduct(product) {
      return product.tags?.some((tag) => GWCA.TAGS_TO_HIDE.includes(tag))
    }

    /**
     * Creates a product element from a template and sets up its form fields.
     * @param {Object} product - The product data.
     * @param {HTMLTemplateElement} template - The template for the product.
     * @param {string} removeButtonAction - The attribute for the remove button action.
     * @returns {DocumentFragment} - The populated product element.
     */
    _createProductElement(product, template, removeButtonAction) {
      const element = template.content.cloneNode(true)
      const productTitle = element.querySelector('[data-product-title]')
      const productLinks = element.querySelectorAll('[data-product-link]')
      const productImage = element.querySelector('[data-product-image]')
      const quickAddForm = element.querySelector(
        '[data-quick-add-to-cart-form]'
      )
      const compareAtPriceEl = element.querySelector(
        '[data-product-price-compare]'
      )
      const priceEl = element.querySelector('[data-product-price]')

      element
        .querySelector('.gw-product-card')
        .setAttribute('data-product-id', GWUtils.parseVariantId(product.id))

      if (productLinks.length) {
        productLinks.forEach((productLink) => {
          productLink.href = `/products/${product.handle}`
        })
      }

      if (productTitle) {
        productTitle.textContent = product.title
      }

      if (productImage && product.featuredImage?.url) {
        productImage.src = product.featuredImage.url

        if (product.featuredImage.altText) {
          productImage.alt = product.featuredImage.altText
        }
      }

      if (quickAddForm) {
        // Handle variants
        this._populateVariantFields(product, quickAddForm)

        // Set product ID
        const productIdHiddenInput = document.createElement('input')
        productIdHiddenInput.type = 'hidden'
        productIdHiddenInput.name = 'productId'
        productIdHiddenInput.value = GWUtils.parseVariantId(product.id)
        quickAddForm.prepend(productIdHiddenInput)
      }

      // Set product prices
      this._updatePriceDisplay(product, compareAtPriceEl, priceEl)

      // Set remove button action if applicable
      if (removeButtonAction) {
        const removeButton = element.querySelector('[data-remove-button]')
        if (removeButton) {
          removeButton.setAttribute(removeButtonAction, '')

          if (removeButtonAction === 'data-saved-from-cart-remove') {
            removeButton.setAttribute(
              'aria-label',
              `Remove ${product.title} from saved items`
            )
          }

          if (removeButtonAction === 'data-wishlist-remove') {
            removeButton.setAttribute(
              'aria-label',
              `Remove ${product.title} from favorites`
            )
          }
        }
      }

      // If there is a gw-wishlist-button element, populate it with the product ID
      const wishlistButton = element.querySelector('gw-wishlist-button')
      if (wishlistButton) {
        wishlistButton.setAttribute(
          'product-id',
          GWUtils.parseVariantId(product.id)
        )

        const scriptTag = document.createElement('script')
        scriptTag.type = 'application/json'
        scriptTag.setAttribute('data-product-data', '')
        scriptTag.textContent = JSON.stringify(product)

        wishlistButton.appendChild(scriptTag)
      }

      return element
    }

    /**
     * Populates the variant fields for a product, creating a select if multiple variants exist.
     * @param {Object} product - The product object.
     * @param {HTMLFormElement} form - The form element where variants will be appended.
     */
    _populateVariantFields(product, form) {
      const variants = product.variants?.nodes || []
      if (variants.length > 1) {
        const selectElement = document.createElement('select')
        selectElement.name = 'id'
        selectElement.classList.add('gw-product-card__variant-selector')

        variants.forEach((variant) => {
          const option = document.createElement('option')
          const variantId = GWUtils.parseVariantId(variant.id)
          option.value = variantId
          option.textContent = variant.title
          if (variantId === product.variant_id) {
            option.selected = true
          }
          selectElement.appendChild(option)
        })

        form.prepend(selectElement)
      } else if (variants.length === 1) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'id'
        input.value = product.variant_id
          ? product.variant_id
          : GWUtils.parseVariantId(variants[0].id)
        form.prepend(input)
      }
    }

    /**
     * Updates the price display elements for a product.
     * @param {Object} product - The product object.
     * @param {HTMLElement} compareAtPrice - The compare at price element.
     * @param {HTMLElement} price - The price element.
     */
    _updatePriceDisplay(product, $compareAtPrice, $price) {
      let currentVariant = product.variants?.nodes[0]

      if (product.variant_id) {
        const selectedVariant = product.variants?.nodes.find((variant) => {
          return GWUtils.parseVariantId(variant.id) === product.variant_id
        })

        if (selectedVariant) {
          currentVariant = selectedVariant
        }
      }

      const compareAtPrice = currentVariant?.compareAtPrice
      const price = currentVariant?.price

      if ($compareAtPrice && compareAtPrice) {
        $compareAtPrice.textContent = compareAtPrice.includes('$')
          ? compareAtPrice
          : `$${compareAtPrice}`
      }

      if (price && $price) {
        if (typeof price === 'number') {
          $price.textContent = GWUtils.formatMoney(price)
        } else {
          const formattedPrice = '$' + price
          $price.textContent = price.includes('$') ? price : formattedPrice
        }
      }

      if (compareAtPrice && price) {
        $compareAtPrice.removeAttribute('hidden')
        $price.classList.add('gw-product-card__price--sale')
      }
    }

    /**
     * Ensures that the corresponding drawer for a container is not marked as empty.
     * @param {HTMLElement} container - The container element.
     */
    _ensureDrawerNotEmpty(container) {
      const drawerSelector = container.getAttribute('data-drawer-selector')
      if (drawerSelector) {
        const drawer = GWUtils.appShadow.querySelector(`#${drawerSelector}`)
        if (drawer) drawer.removeAttribute('empty')
      }
    }

    /**
     * Populates a carousel item with product information.
     * @param {DocumentFragment} productElement - The product element fragment.
     * @param {Object} product - The product object.
     * @returns {HTMLElement} - The populated carousel item.
     */
    _populateCarouselItem(productElement, product) {
      const populatedProductElement = this._populateProductCard(
        productElement,
        product
      )

      const carouselItem = document.createElement('sl-carousel-item')
      carouselItem.setAttribute(
        'data-product-id',
        GWUtils.parseVariantId(product.id)
      )
      carouselItem.appendChild(populatedProductElement)

      return carouselItem
    }

    /**
     * Populates a product card element with product information.
     * @param {DocumentFragment} element - The product card element fragment.
     * @param {Object} product - The product object.
     */
    _populateProductCard(element, product) {
      const productTitle = element.querySelector('[data-product-title]')
      const productLink = element.querySelector('[data-product-link]')
      const productImage = element.querySelector('[data-product-image]')
      const compareAtPriceEl = element.querySelector(
        '[data-product-price-compare]'
      )
      const priceEl = element.querySelector('[data-product-price]')

      if (productTitle) productTitle.textContent = product.title
      if (productLink) productLink.href = `/products/${product.handle}`
      if (productImage && product.featuredImage?.url) {
        productImage.src = product.featuredImage.url

        if (product.featuredImage.altText) {
          productImage.alt = product.featuredImage.altText
        }
      }

      this._updatePriceDisplay(product, compareAtPriceEl, priceEl)

      // If there is a gw-wishlist-button element, populate it with the product ID
      const wishlistButton = element.querySelector('gw-wishlist-button')
      if (wishlistButton) {
        wishlistButton.setAttribute(
          'product-id',
          GWUtils.parseVariantId(product.id)
        )

        const scriptTag = document.createElement('script')
        scriptTag.type = 'application/json'
        scriptTag.setAttribute('data-product-data', '')
        scriptTag.textContent = JSON.stringify(product)

        wishlistButton.appendChild(scriptTag)
      }

      return element
    }
  }
)

customElements.define(
  'gw-customer-accounts-orders',
  class GWCustomerAccountsOrders extends GWCustomerAccountsTab {
    constructor() {
      super()
    }

    connectedCallback() {
      super.connectedCallback()
    }
  }
)

customElements.define(
  'gw-customer-accounts-profile',
  class GWCustomerAccountsProfile extends GWCustomerAccountsTab {
    constructor() {
      super()
    }

    connectedCallback() {
      super.connectedCallback()

      this.querySelector('[data-logout-button]')?.addEventListener(
        'click',
        function (event) {
          event.preventDefault()
          this.querySelector('[data-loader]').hidden = false

          localStorage.removeItem(GWCA.STORAGE_KEYS.TOKEN)
          localStorage.removeItem(GWCA.STORAGE_KEYS.EMAIL)

          window.location.href = '/account/logout'
        }
      )
    }
  }
)

customElements.define(
  'gw-customer-accounts-sign-in',
  class GWCustomerAccountsSignIn extends HTMLElement {
    constructor() {
      super()
      this.signInType = this.getAttribute('type')
      this.signInBlock = this.querySelector('[data-sign-in-block]')
      if (this.signInType === 'password') return;

      this.verifyCodeBlock = this.querySelector('[data-verify-code-block]')
      this.tryAnotherEmailButton = this.querySelector(
        '[data-try-another-email]'
      )
      this.sendAnotherCodeButton = this.querySelector(
        '[data-send-another-code]'
      )

      this.inputtedEmail = ''
      this.inputtedCode = ''
    }

    connectedCallback() {
      // If the sign-in type is password, redirect to the sign-in page
      if (this.signInType === 'password') {
        const signInLink = this.querySelector("[data-sign-in-button]");
        const signInLinkHref = signInLink.getAttribute("href");

        signInLink.addEventListener("click", (event) => {
          event.preventDefault();
          let tempLinkHref = signInLinkHref
          if (tempLinkHref.includes("?")) {
            tempLinkHref += "&" + "return_url=" + window.location.pathname + "?my-account-open=true";
          }

          window.location.href = tempLinkHref;
        });
      } else {
        this._handleEmailSubmitForm()
        this._handleInputCodeGroup()
        
        this.tryAnotherEmailButton.addEventListener('click', () => {
          this.signInBlock.removeAttribute('hidden')
          this.verifyCodeBlock.setAttribute('hidden', '')
          
          this.signInBlock.querySelector('sl-input').value = ''
          this.signInBlock.querySelector('sl-input').focus()
          
          this.inputtedEmail = ''
          this.inputtedCode = ''
        })
        
        this.sendAnotherCodeButton.addEventListener('click', () => {
          this._submitEmailForm(this.querySelector('[data-sign-in-form]'))
          GWUtils.notify('Another code has been sent to your email.')
        })
      }
    }
      
    /**
     * Handles the email submit form.
     * @returns {void}
     */
    async _handleEmailSubmitForm() {
      await Promise.all([customElements.whenDefined('sl-input')]).then(() => {
        const emailSubmitForm = this.querySelector('[data-sign-in-form]')
        const emailErrorBox = this.querySelector('[data-email-error]')

        emailSubmitForm.addEventListener(
          'sl-invalid',
          (event) => {
            event.preventDefault()

            emailErrorBox.textContent = event.target.validationMessage
            emailErrorBox.hidden = false

            event.target.focus()
          },
          { capture: true }
        )

        emailSubmitForm.addEventListener('submit', (event) => {
          event.preventDefault()

          emailErrorBox.hidden = true
          emailErrorBox.textContent = ''

          this._submitEmailForm(emailSubmitForm).then(() => {
            // Focus on the first input in the next block
            const firstInputInNextBlock =
              this.verifyCodeBlock.querySelector('.code-input')
            if (firstInputInNextBlock) firstInputInNextBlock.focus()
          })
        })
      })
    }

    /**
     * Submits the email form to request a verification code.
     * @param {HTMLFormElement} form - The email form element.
     * @returns {void}
     */
    async _submitEmailForm(form) {
      const submitButton = form.querySelector('button[type="submit"]')
      submitButton.disabled = true
      submitButton.querySelector('[data-loader]').hidden = false

      const formData = new FormData(form)
      this.inputtedEmail = formData.get('email')

      try {
        const response = await this._request(
          { customerEmail: this.inputtedEmail },
          GWCA.ENDPOINTS.AUTH.SIGN_IN
        )

        if (response.error) {
          console.error(response.error)
          return
        }

        const $codeSentToBlock = this.querySelector('[data-code-sent-to]')
        if ($codeSentToBlock) $codeSentToBlock.textContent = this.inputtedEmail

        this.signInBlock.setAttribute('hidden', '')
        this.verifyCodeBlock.removeAttribute('hidden')

        return response
      } catch (error) {
        console.error(error)
        alert('An error occurred. Please try again later.')
      } finally {
        submitButton.disabled = false
        submitButton.querySelector('[data-loader]').hidden = true
      }
    }

    /**
     * Submits the verification code to sign in the customer.
     * @returns {void}
     * @async
     */
    async _submitVerificationCode() {
      const verifyActionButtonsWrapper = this.querySelector(
        '.gw-verify-code__actions'
      )
      const verifyActionsButtons =
        verifyActionButtonsWrapper.querySelectorAll('button, a')
      const verifyErrorBox = verifyActionButtonsWrapper.querySelector(
        '[data-verify-error]'
      )
      const verifyLoader =
        verifyActionButtonsWrapper.querySelector('[data-loader]')
      const verifyInputs = this.querySelectorAll('input.code-input')

      try {
        verifyInputs.forEach((input) => {
          input.disabled = true
        })

        verifyActionsButtons.forEach((button) => {
          button.disabled = true
          button.hidden = true
        })

        verifyErrorBox.hidden = true
        verifyLoader.hidden = false

        const verificationResponse = await this._request(
          { customerEmail: this.inputtedEmail, code: this.inputtedCode },
          GWCA.ENDPOINTS.AUTH.VERIFY_CODE
        )

        if (!verificationResponse.url) {
          throw new Error('Verification failed')
        }

        // Save the token to session storage
        localStorage.setItem(
          GWCA.STORAGE_KEYS.TOKEN,
          verificationResponse.token
        )

        // Save the email to session storage
        localStorage.setItem(GWCA.STORAGE_KEYS.EMAIL, this.inputtedEmail)

        const signinResponse = await fetch(verificationResponse.url)

        if (signinResponse.error) {
          throw new Error(signinResponse.error)
        }

        const updatedSiteResponse = await fetch(window.location.href)
        const updatedSiteText = await updatedSiteResponse.text()

        // Update the site with the new content
        document.documentElement.innerHTML = updatedSiteText

        // Redirect if there is a session storage redirect URL
        const redirectURL = sessionStorage.getItem(
          GWCA.STORAGE_KEYS.REDIRECT_URL
        )
        if (redirectURL) {
          sessionStorage.removeItem(GWCA.STORAGE_KEYS.REDIRECT_URL)
          window.location.href = redirectURL
        }

        // If we are on a one of the loyalty pages, reload the page to show the customer's points
        const updatedSiteHTML = new DOMParser().parseFromString(
          updatedSiteText,
          'text/html'
        )
        const gwIntegrationsLoyaltyPoints = updatedSiteHTML
          .querySelector('#gw-customer-accounts-template')
          .content?.querySelector('gw-integrations-loyalty-points')
        if (!gwIntegrationsLoyaltyPoints) return

        const currentPath = window.location.pathname
        const loyaltyPath = gwIntegrationsLoyaltyPoints.getAttribute('page-url')

        if (currentPath.includes(loyaltyPath)) {
          window.location.reload()
        }
      } catch (error) {
        console.error(error)

        setTimeout(() => {
          // Change focus to the last input box
          verifyInputs[verifyInputs.length - 1].focus()
        })
      } finally {
        verifyInputs.forEach((input) => {
          input.disabled = false
        })

        verifyActionsButtons.forEach((button) => {
          button.disabled = false
          button.hidden = false
        })

        verifyErrorBox.hidden = false
        verifyLoader.hidden = true
      }
    }

    /**
     * Makes a request to the customer accounts API.
     * @param {Object} body - The request body.
     * @param {string} url - The API endpoint URL.
     * @param {string} [method='POST'] - The request method.
     * @returns {Promise<Object>} - The response data.
     * @async
     */
    async _request(body, url, method = 'POST') {
      const response = await fetch(GWUtils.baseURL + url, {
        method: method,
        body: JSON.stringify(body),
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return await response.json()
    }

    /**
     * Handles the input code group for the verification code.
     * @returns {void}
     */
    _handleInputCodeGroup() {
      const inputElements = [...this.querySelectorAll('input.code-input')]

      inputElements.forEach((ele, index) => {
        ele.addEventListener('keydown', (e) => {
          // Allow Ctrl + V and Cmd + V for pasting
          if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
            return
          }

          // Allow only numbers
          if (e.keyCode !== 8 && (e.keyCode < 48 || e.keyCode > 57)) {
            e.preventDefault()
          }

          // Focus on the previous input box if backspace is pressed and the current input box is empty
          if (e.keyCode === 8 && e.target.value === '') {
            inputElements[Math.max(0, index - 1)].focus()
          }
        })

        ele.addEventListener('input', (e) => {
          const [first, ...rest] = e.target.value
          e.target.value = first ?? ''

          const lastInputBox = index === inputElements.length - 1
          const didInsertContent = first !== undefined

          if (didInsertContent && !lastInputBox) {
            inputElements[index + 1].focus()
            inputElements[index + 1].value = rest.join('')
            inputElements[index + 1].dispatchEvent(new Event('input'))
          }

          // if last input box entered and all boxes are filled, submit the form
          if (
            didInsertContent &&
            lastInputBox &&
            inputElements.every((input) => input.value)
          ) {
            this.inputtedCode = inputElements
              .map((input) => input.value)
              .join('')

            this._submitVerificationCode()
          }
        })
      })
    }
  }
)

customElements.define(
  'gw-address-form',
  class GWAddressForm extends HTMLElement {
    constructor() {
      super()
      this.form = this.querySelector('form')
      this.type = this.getAttribute('type')
      this.addressId = this.getAttribute('address-id')
    }

    connectedCallback() {
      this._handleFormSubmit()

      if (this.type === 'edit') {
        this.querySelector('[data-delete-address]').addEventListener(
          'click',
          () => {
            this._deleteAddress()
          }
        )
      }

      if (this.type === 'edit') {
        // this._handleSubmitButton();
      }
    }

    /**
     * Handles the form submission for adding or editing an address.
     * @returns {void}
     * @async
     */
    async _handleFormSubmit() {
      await Promise.all([customElements.whenDefined('sl-input')]).then(() => {
        this.form.addEventListener(
          'sl-invalid',
          (event) => {
            event.preventDefault()

            // Remove existing error messages
            this._clearErrorMessages()

            // Create new error messages
            this.form.querySelectorAll('sl-input').forEach((element) => {
              if (element.hasAttribute('data-invalid')) {
                const errorBox = document.createElement('div')
                errorBox.slot = 'help-text'
                errorBox.classList.add('gw-error-message')
                errorBox.textContent = element.validationMessage

                element.appendChild(errorBox)
              }
            })

            event.target.focus()
          },
          { capture: true }
        )

        this.form.addEventListener('submit', (event) => {
          event.preventDefault()

          const formData = new FormData(this.form)
          const address = Object.fromEntries(formData.entries())

          this._submitAddressForm(address)
        })
      })
    }

    /**
     * Submits the address form for adding or editing an address.
     * @param {Object} address - The address object.
     * @returns {void}
     */
    async _submitAddressForm(address) {
      try {
        // Remove existing error messages
        this._clearErrorMessages()

        this.form.querySelector('[data-loader]').hidden = false

        // Convert underscores to back to spaces for the province and country
        if (address.province)
          address.province = address.province.replaceAll('_', ' ')
        address.country = address.country.replaceAll('_', ' ')

        let isDefault = address.isDefault
        delete address.isDefault

        let response = null

        if (this.type === 'edit') {
          response = await GWUtils.request(GWCA.ENDPOINTS.ADDRESS.EDIT, {
            address,
            addrID: this.addressId,
            isDefault: isDefault,
          })
        } else {
          response = await GWUtils.request(GWCA.ENDPOINTS.ADDRESS.ADD, {
            address,
            isDefault: isDefault,
          })
        }

        if (response.error) {
          throw new Error(response.error)
        }

        this.form.closest('sl-drawer').hide()

        GWUtils.updateAjaxContent([
          '[data-gw-addresses-list]',
          '[data-gw-addresses-carousel]',
        ])
      } catch (error) {
        console.error(error)
      } finally {
        this.form.querySelector('[data-loader]').hidden = true
      }
    }

    /**
     * Deletes an address.
     * @returns {void}
     * @async
     */
    async _deleteAddress() {
      try {
        this.querySelector('[data-delete-address]').querySelector(
          '[data-loader]'
        ).hidden = false

        let response = await GWUtils.request(GWCA.ENDPOINTS.ADDRESS.REMOVE, {
          addrID: this.addressId,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        this.form.closest('sl-drawer').hide()

        await GWUtils.app.updateContent([
          '[data-gw-addresses-list]',
          '[data-gw-addresses-carousel]',
        ])
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * Handles the submit button for the form. Shows the submit button if any fields have changed.
     * @returns {void}
     */
    _handleSubmitButton() {
      const formElements = this.form.querySelectorAll(
        'sl-input, sl-select, sl-checkbox'
      )
      const submitButton = this.form.querySelector('button[type="submit"]')

      const checkChangedFields = () => {
        const hasChangedFields = Array.from(formElements).some((element) => {
          if (element.tagName === 'SL-CHECKBOX') {
            const defaultChecked = element.getAttribute('defaultChecked')
            const currentChecked = element.getAttribute('checked')

            return defaultChecked !== currentChecked
          }

          const defaultValue = element.getAttribute('value')
          const currentValue = element.value

          return defaultValue !== currentValue
        })

        return hasChangedFields
      }

      formElements.forEach((formElement) => {
        formElement.addEventListener('sl-input', () => {
          if (checkChangedFields()) {
            submitButton.hidden = false
          } else {
            submitButton.hidden = true
          }
        })
      })
    }

    /**
     * Clears any error messages from the form.
     * @returns {void}
     */
    _clearErrorMessages() {
      this.form
        .querySelectorAll('.gw-error-message')
        .forEach((errorBox) => errorBox.remove())
    }
  }
)

customElements.define(
  'gw-preferences-form',
  class GWPreferencesForm extends HTMLElement {
    constructor() {
      super()
      this.form = this.querySelector('form')
    }

    connectedCallback() {
      this._handleFormSubmit()
    }

    /**
     * Handles the form submission for updating customer preferences.
     * @returns {void}
     */
    async _handleFormSubmit() {
      await Promise.all([customElements.whenDefined('sl-input')]).then(() => {
        this.form.addEventListener(
          'sl-invalid',
          (event) => {
            event.preventDefault()

            // Remove existing error messages
            this._clearErrorMessages()

            // Create new error messages
            this.form.querySelectorAll('sl-input').forEach((element) => {
              if (element.hasAttribute('data-invalid')) {
                const errorBox = document.createElement('div')
                errorBox.slot = 'help-text'
                errorBox.classList.add('gw-error-message')
                errorBox.textContent = element.validationMessage

                element.appendChild(errorBox)
              }
            })
          },
          { capture: true }
        )

        this.form.addEventListener('submit', (event) => {
          event.preventDefault()

          const formData = new FormData(this.form)
          const preferences = Object.fromEntries(formData.entries())

          this._submitPreferencesForm(preferences)
        })
      })
    }

    /**
     * Submits the customer preferences form.
     * @param {Object} preferences - The customer preferences.
     * @returns {void}
     */
    async _submitPreferencesForm(preferences) {
      try {
        // Remove existing error messages
        this._clearErrorMessages()

        this.form.querySelector('[data-loader]').hidden = false

        let response = await GWUtils.request(
          GWCA.ENDPOINTS.CUSTOMER.UPDATE,
          preferences
        )

        if (response.error) {
          throw new Error(response.error)
        }

        this.form.closest('sl-drawer').hide()

        GWUtils.updateAjaxContent([
          '[data-main-drawer-label]',
          '[data-my-preference-fields]',
        ])
      } catch (error) {
        this._handleErrors(error)
      } finally {
        this.form.querySelector('[data-loader]').hidden = true
      }
    }

    /**
     * Clears any error messages from the form.
     * @returns {void}
     */
    _clearErrorMessages() {
      this.form
        .querySelectorAll('.gw-error-message')
        .forEach((errorBox) => errorBox.remove())
    }

    _handleErrors(error) {
      if (error.message.includes('valid phone number')) {
        this._displayErrorMessage('[name="phone"]', error.message)
      }
    }

    _displayErrorMessage(element, message) {
      let formElement = element

      if (typeof element === 'string') {
        formElement = this.form.querySelector(element)
      }

      const errorBox = document.createElement('div')
      errorBox.slot = 'help-text'
      errorBox.classList.add('gw-error-message')
      errorBox.textContent = message

      formElement.appendChild(errorBox)
      formElement.focus()
    }
  }
)

customElements.define(
  'gw-customer-accounts-country-selector',
  class GWCustomerAccountsCountrySelector extends HTMLElement {
    constructor() {
      super()
      this.countrySelector = this.querySelector('sl-select[name="country"]')
    }

    connectedCallback() {
      this.countrySelector.addEventListener('sl-change', () => {
        const selectedOption = this.countrySelector.selectedOptions[0]

        this._renderProvinces(selectedOption)
      })

      // Wait for the custom elements to be defined, then render the provinces for the default selected country
      Promise.all([customElements.whenDefined('sl-select')]).then(() => {
        setTimeout(() => {
          const defaultSelectedOption = this.countrySelector.selectedOptions[0]
          this._renderProvinces(defaultSelectedOption)
        }, 1000)
      })

      this._updateOptionElements()
    }

    /**
     * Renders the provinces for the selected country.
     * @param {HTMLElement} selectedOption - The selected country option.
     * @returns {void}
     */
    _renderProvinces(selectedOption) {
      // Remove existing province selectors
      const provinceSelectors = this.closest('form').querySelectorAll(
        'sl-select[name="province"]'
      )
      provinceSelectors.forEach((selector) => selector.remove())

      // Get the provinces for the selected country
      const provinces = JSON.parse(
        selectedOption.getAttribute('data-provinces')
      )
      if (!provinces || !provinces.length) {
        return
      }

      const provinceSelector = document.createElement('sl-select')
      provinceSelector.setAttribute('name', 'province')
      provinceSelector.label = 'State'
      provinceSelector.required = true

      provinces.forEach((province) => {
        const option = document.createElement('sl-option')
        option.value = province[0].replaceAll(' ', '_')
        option.textContent = province[1]

        provinceSelector.appendChild(option)
      })

      provinceSelector.setAttribute('value', provinces[0][0])

      this.after(provinceSelector)
    }

    /**
     * Updates the option elements to use the sl-option tag.
     * @returns {void}
     */
    _updateOptionElements() {
      this.countrySelector.querySelectorAll('option').forEach((option) => {
        option.value = option.value.replaceAll(' ', '_')

        // Replace tag name with sl-option
        option.outerHTML = option.outerHTML.replace(/option/g, 'sl-option')
      })
    }
  }
)

customElements.define(
  'gw-quick-add-to-cart-form',
  class GWQuickAddToCartForm extends HTMLElement {
    constructor() {
      super()
      this.form = this.querySelector('form')
      this.productId = this.getAttribute('product-id')
    }

    connectedCallback() {
      this.form.addEventListener('submit', async (event) => {
        event.preventDefault()
        this._handleFormSubmit()
      })

      this.addEventListener('click', (event) => {
        if (event.target.matches('[data-wishlist-remove]')) {
          const productCard = this.closest('.gw-product-card')
          const wishlistButton = productCard.querySelector('gw-wishlist-button')
          wishlistButton.dispatchEvent(new Event('click'))
        }

        if (event.target.matches('[data-saved-from-cart-remove]')) {
          this._handleRemoveFromSavedItems()
        }
      })
    }

    /**
     * Handles the form submission for adding a product to the cart.
     * @returns {void}
     */
    async _handleFormSubmit() {
      this.form.querySelector('[data-loader]').hidden = false

      const formData = new FormData(this.form)

      const config = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: `application/javascript`,
        },
      }

      try {
        const response = await fetch(routes.cart_add_url, config)

        if (response.error) {
          throw new Error(response.error)
        }

        GWUtils.notify(`
          <span>Product added to cart</span>
          <a href="/cart" class="gw-notification__link">View</a>
        `)
      } catch (error) {
        console.error(error)
      } finally {
        this.form.querySelector('[data-loader]').hidden = true

        // Dispatch an event to update the saved items list
        if (!this.closest('[data-favorites-drawer-container]')) return

        const productId = this.form.querySelector('[name="productId"]').value
        const variantId = this.form.querySelector('[name="id"]').value

        if (!productId || !variantId) return
        const event = new CustomEvent(
          GWCA.CUSTOM_EVENTS.SAVED_ITEMS_FROM_CART,
          {
            detail: {
              productId: productId,
              variantId: variantId,
              target: this,
            },
          }
        )

        GWUtils.app.dispatchEvent(event)
      }
    }

    /**
     * Handles removing a product from the saved items list.
     * @returns {void}
     */
    async _handleRemoveFromSavedItems() {
      if (!GWUtils.hasCustomer) {
        const productId = this.form.querySelector('[name="productId"]').value
        const currentTEMPCartProducts =
          JSON.parse(
            localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS)
          ) || []

        const updatedTEMPCartProducts = currentTEMPCartProducts.filter(
          (product) => product.id != productId
        )

        localStorage.setItem(
          GWCA.STORAGE_KEYS.TEMP_CART_PRODUCTS,
          JSON.stringify(updatedTEMPCartProducts)
        )

        GWUtils.dashboard.loadSavedCartItems()

        return
      }

      this.form
        .closest('.gw-product-card')
        .classList.add('gw-product-card--removing')

      const body = {
        prodID: this.form.querySelector('[name="productId"]').value,
      }

      try {
        const response = await GWUtils.request(GWCA.ENDPOINTS.CART.REMOVE, body)

        if (response.error) {
          throw new Error(response.error)
        }

        await GWUtils.dashboard.loadSavedCartItems()
      } catch (error) {
        console.error(error)
      }
    }
  }
)

customElements.define(
  'gw-wishlist-button',
  class GWWishlistButton extends HTMLElement {
    constructor() {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
      this.isIconOnly = this.hasAttribute('icon-only')

      const iconTemplate = this.querySelector('template[name="icon"]')
      this.iconEl = this._createIcon(iconTemplate, 'icon')

      const filledIconTemplate = this.querySelector(
        'template[name="filled-icon"]'
      )
      this.filledIconEl = this._createIcon(filledIconTemplate, 'filled-icon')

      if (this.hasAttribute('icon-only')) {
        this.shadowRoot.innerHTML = `
          <button class="wishlist-button wishlist-button--icon-only" part="button">
            ${this.iconEl}
            ${this.filledIconEl}
          </button>
        `
      } else {
        this.shadowRoot.innerHTML = `
          <button class="wishlist-button" part="button">
            <span class="icon-container" part="icon-container">
              ${this.iconEl}
              ${this.filledIconEl}
            </span>
            <span class="" data-button-label></span>
            <span class="loader" data-loader></span>
          </button>
        `
      }

      this.productId = this.getAttribute('product-id')
      this.variantId = this.getAttribute('variant-id')

      this.labels = {
        inactive:
          GWUtils.componentData.wishlist?.addToWishlistLabel ||
          'Add to wishlist',
        active:
          GWUtils.componentData.wishlist?.addedToWishlistLabel ||
          'Added to wishlist',
      }

      this.button = this.shadowRoot.querySelector('button')
      this.buttonLabel = this.shadowRoot.querySelector('[data-button-label]')
      this.loader = this.shadowRoot.querySelector('[data-loader]')
      this.buttonIcon = this.shadowRoot.querySelectorAll('[data-button-icon]')
    }

    connectedCallback() {
      // Add the event listener for the button click
      this.addEventListener('click', (e) => this._handleFavoriteButtonClick(e))

      // Display initial state of the button
      this._activateButton(this._isProductInFavorites())

      // Listen for the wishlist initialization event
      GWUtils.app.addEventListener(
        GWCA.CUSTOM_EVENTS.FAVORITES_STORAGE_UPDATED,
        () => {
          this._activateButton(this._isProductInFavorites())
        }
      )
    }

    _createIcon(template, partName) {
      if (!template) {
        return ''
      }

      const clone = template.content.cloneNode(true)
      const svgEl = clone.querySelector('svg')
      svgEl.setAttribute('part', partName)
      svgEl.setAttribute('data-button-icon', '')
      svgEl.setAttribute('hidden', '')
      return svgEl.outerHTML
    }

    /**
     * Gets the variant ID from the URL if it exists.
     * @returns {number} The variant ID.
     */
    _getVariantId() {
      const params = new URLSearchParams(window.location.search)
      const variantIdFromUrl = params.get('variant')

      if (!variantIdFromUrl) return this.variantId

      return variantIdFromUrl
    }

    async _handleFavoriteButtonClick(event) {
      event.preventDefault()
      event.stopPropagation()

      this.button.disabled = true
      this.button.setAttribute('aria-disabled', 'true')
      this.setAttribute('processing', '')

      if (this.loader) this.loader.hidden = false

      if (!this.hasAttribute('saved')) {
        // Activate the button to prevent multiple clicks
        this._activateButton(true)

        try {
          // Add the product to the favorites list
          const favResponse = await this._addToFavorites()

          if (favResponse.error) {
            throw new Error(favResponse.error)
          }

          const favoritedProduct = favResponse.products
          if (!favoritedProduct) {
            throw new Error('Product not found')
          }

          // Add the favorited product id to the storage and reinitialize all wishlist buttons
          GWUtils.app.updateFavoriteItemsStorage({
            addIds: [GWUtils.parseVariantId(favoritedProduct.id)],
          })

          // Render the favorited product to the customer's dashboard
          GWUtils.dashboard._renderSingleFavoriteItem(favoritedProduct)

          // Notify the customer
          const customerFirstName = GWUtils.customerFirstName
            ? `${GWUtils.customerFirstName}'s`
            : 'Your'
          GWUtils.notify(`
            <span>Added to ${customerFirstName} favorites</span>
            <a href="#my-favorites" class="gw-notification__link">View</a>
          `)
        } catch (error) {
          console.error(error)
          this._activateButton(false)
          GWUtils.notify('An error occurred. Please try again later.')
        }
      } else {
        this._activateButton(false)

        try {
          // Remove the product from the favorites list
          const removeFavResponse = await this._removeFromFavorites()

          if (removeFavResponse.error) {
            throw new Error(removeFavResponse.error)
          }

          const unfavoritedProduct = removeFavResponse.products
          if (!unfavoritedProduct) {
            throw new Error('Product not found')
          }

          // Remove the favorited product from carousel and drawer
          GWUtils.dashboard._removeFavoriteItem(
            GWUtils.parseVariantId(unfavoritedProduct.id)
          )

          // Reinitialize all wishlist buttons
          GWUtils.app.updateFavoriteItemsStorage({
            removeIds: [GWUtils.parseVariantId(unfavoritedProduct.id)],
          })

          // Notify the user
          const customerFirstName = GWUtils.customerFirstName
            ? `${GWUtils.customerFirstName}'s`
            : 'Your'
          GWUtils.notify(`
            <span>Product removed from ${customerFirstName} favorites</span>
            <a href="#my-favorites" class="gw-notification__link">View</a>
          `)
        } catch (error) {
          console.error(error)
          this._activateButton(true)
          GWUtils.notify('An error occurred. Please try again later.')
        }
      }

      if (this.loader) this.loader.hidden = true
      this.button.disabled = false
      this.button.removeAttribute('aria-disabled')
      this.removeAttribute('Processing')
    }

    /**
     * Adds the product to the favorites list.
     * @returns {Promise<void>}
     */
    async _addToFavorites() {
      if (!GWUtils.hasCustomer) {
        const productDataElement = this.querySelector('[data-product-data]')
        const parsedProductData = JSON.parse(productDataElement.textContent)

        const stored =
          localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS) || '[]'
        const items = JSON.parse(stored)

        const updatedItems = items.filter(
          (item) => item.id !== parsedProductData.id
        )
        updatedItems.push(parsedProductData)

        localStorage.setItem(
          GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS,
          JSON.stringify(updatedItems)
        )

        return {
          success: true,
          products: parsedProductData,
        }
      }

      const response = await GWUtils.request(GWCA.ENDPOINTS.FAVORITES.ADD, {
        prodID: this.productId,
        varID: this._getVariantId(),
      })

      if (response.error) {
        throw new Error(response.error)
      }

      return response
    }

    /**
     * Removes the product from the favorites list.
     * @returns {Promise<void>}
     */
    async _removeFromFavorites() {
      if (!GWUtils.hasCustomer) {
        const productData = this.querySelector('[data-product-data]')
        const parsedProductData = JSON.parse(productData.textContent)

        const stored =
          localStorage.getItem(GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS) || '[]'
        const items = JSON.parse(stored)

        const updatedItems = items.filter(
          (item) => item.id !== parsedProductData.id
        )
        localStorage.setItem(
          GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS,
          JSON.stringify(updatedItems)
        )

        return {
          success: true,
          products: parsedProductData,
        }
      }

      const response = await GWUtils.request(GWCA.ENDPOINTS.FAVORITES.REMOVE, {
        prodID: this.productId,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      return response
    }

    /**
     * Activates the button based on whether the product is in the favorites list.
     * @param {boolean} isProductInFavorites - True if the product is in the favorites list, otherwise false.
     * @returns {void}
     */
    _activateButton(isProductInFavorites) {
      if (this.buttonIcon.length)
        this.buttonIcon.forEach((icon) => icon.removeAttribute('hidden'))
      if (this.loader) this.loader.setAttribute('hidden', '')

      if (isProductInFavorites) {
        this.setAttribute('saved', '')
        this.button.setAttribute('aria-label', this.labels.active)
        if (this.buttonLabel) this.buttonLabel.textContent = this.labels.active
      } else {
        this.removeAttribute('saved')
        this.button.setAttribute('aria-label', this.labels.inactive)
        if (this.buttonLabel)
          this.buttonLabel.textContent = this.labels.inactive
      }
    }

    /**
     * Checks if the product is in the favorites list.
     * @returns {boolean} True if the product is in the favorites list, otherwise false.
     */
    _isProductInFavorites() {
      if (!GWUtils.hasCustomer) {
        const tempWishlistItemsStorage = localStorage.getItem(
          GWCA.STORAGE_KEYS.TEMP_WISHLIST_PRODUCTS
        )
        const tempWishlistItems = tempWishlistItemsStorage
          ? JSON.parse(tempWishlistItemsStorage)
          : []

        return tempWishlistItems.some((item) => item.id === this.productId)
      }

      const wishlistItemsStorage = sessionStorage.getItem(
        GWCA.STORAGE_KEYS.WISHLIST_PRODUCT_IDS
      )
      const wishlistItems = wishlistItemsStorage
        ? JSON.parse(wishlistItemsStorage)
        : []

      return wishlistItems.includes(this.productId)
    }
  }
)

customElements.define(
  'gw-integrations-loyalty-points',
  class GWIntegrationsLoyaltyPoints extends HTMLElement {
    constructor() {
      super()
      this.integration = this.getAttribute('integration')
      this.loyaltyPageUrl = this.getAttribute('page-url')
      this.pointsLabel = this.getAttribute('points-label')
      this.linkLabel = this.getAttribute('link-label')

      this.innerHTML = `
        <a href="${this.loyaltyPageUrl}" class="gw-loyalty-points__link gw-unstyled-link">
          <span class="gw-loader" data-loader></span>
          <span class="gw-loyalty-points__points-value gw-header" data-points-container></span>
          <span class="gw-loyalty-points__points-label" data-points-label hidden>${this.pointsLabel}</span>
          <span class="gw-loyalty-points__link-label">
            ${this.linkLabel}

            <svg
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 32 32'
              aria-hidden='true'
              width='16'
              height='16'
            >
              <path d="m13.333 8 8 8-8 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </span>
        </a>
      `

      this.API = null
      this.SESSION_KEY = null
      this.GET_POINTS = null

      switch (this.integration) {
        case 'loyalty-lion':
          this.API = GWCA.ENDPOINTS.LOYALTY.GET_LL
          this.SESSION_KEY = GWCA.STORAGE_KEYS.LOYALTY_POINTS
          this.GET_POINTS = (response) => response.points_approved
          break
        case 'yotpo':
          this.API = GWCA.ENDPOINTS.LOYALTY.GET_YOTPO_CUSTOMER
          this.SESSION_KEY = GWCA.STORAGE_KEYS.YOTPO_POINTS
          this.GET_POINTS = (response) => response.customer?.points_balance
          break
        case 'rise':
          this.API = GWCA.ENDPOINTS.LOYALTY.GET_RISE_CREDIT
          this.SESSION_KEY = GWCA.STORAGE_KEYS.RISE_POINTS
          this.GET_POINTS = (response) =>
            response.amount ? this._formatUSD(response.amount) : '$0.00'

          this.innerHTML += `
            <div class="gw-loyalty-points__id-container" hidden>
              <span class="gw-loyalty-points__id" data-points-id></span>
              <button class="gw-loyalty-points__copy-button" data-copy-button hidden>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 12" fill="none" aria-hidden="true"><g clip-path="url(#copy-icon-clip-path)"><path d="M11.203 0h-6C4.383 0 3.72.67 3.72 1.497v1.458H2.176a1.491 1.491 0 0 0-1.489 1.49v6.058A1.495 1.495 0 0 0 2.173 12h6c.82 0 1.484-.67 1.484-1.497V9.045H11.2a1.491 1.491 0 0 0 1.489-1.49V1.497A1.495 1.495 0 0 0 11.203 0ZM8.47 10.5c0 .165-.133.299-.297.299h-6a.303.303 0 0 1-.297-.3V4.444c0-.165.133-.299.297-.299h6a.294.294 0 0 1 .297.3v6.058-.004Zm3.03-2.945c0 .166-.133.3-.296.3H9.661v-3.41a1.49 1.49 0 0 0-1.485-1.497h-3.27V1.497c0-.166.133-.3.297-.3h6a.302.302 0 0 1 .297.3v6.058Z" fill="currentColor"></path></g><defs><clipPath id="copy-icon-clip-path"><path fill="#fff" transform="translate(.5)" d="M0 0h12v12H0z"></path></clipPath></defs></svg>
                Copy ID
              </button>
            </div>
          `
          break
        default:
          return
      }
    }

    connectedCallback() {
      this._renderPointsFromSession()
      this._initLoyaltyPoints()

      GWUtils.app.addEventListener(GWCA.CUSTOM_EVENTS.CUSTOMER_ACCOUNT_LOADED, () => {
        console.log('loyalty points updated')
        this._initLoyaltyPoints()
      })
    }

    _formatUSD(amount) {
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    }

    _renderPointsFromSession() {
      const points = sessionStorage.getItem(this.SESSION_KEY)

      if (points) {
        const $loader = this.querySelector('[data-loader]')
        const $pointsContainer = this.querySelector('[data-points-container]')
        const $pointsLabel = this.querySelector('[data-points-label]')

        $pointsContainer.textContent = points
        $pointsLabel.removeAttribute('hidden')
        $loader.hidden = true
      }
    }

    async _initLoyaltyPoints() {
      try {
        const response = await GWUtils.request(this.API)

        if (response.error) {
          throw new Error(response.error)
        }

        const $loader = this.querySelector('[data-loader]')
        $loader.hidden = true

        const $pointsContainer = this.querySelector('[data-points-container]')
        const $pointsLabel = this.querySelector('[data-points-label]')
        const customerPoints = this.GET_POINTS(response)

        if (customerPoints && $pointsContainer) {
          $pointsContainer.textContent = customerPoints
          $pointsLabel.removeAttribute('hidden')

          sessionStorage.setItem(this.SESSION_KEY, customerPoints)
        }

        // Rise integration specific
        if (this.integration === 'rise') {
          const pointsCode = response?.code

          if (!pointsCode) {
            this.querySelector('.gw-loyalty-points__id-container').remove()
            return
          } else {
            this.querySelector(
              '.gw-loyalty-points__id-container'
            ).removeAttribute('hidden')
          }

          const $pointsId = this.querySelector('[data-points-id]')
          const $copyButton = this.querySelector('[data-copy-button]')
          $copyButton.removeAttribute('hidden')

          $pointsId.textContent = 'ID: ' + response.code

          $copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(response?.code)

            GWUtils.notify('ID copied to clipboard')
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
)

customElements.define(
  'gw-malomo-button',
  class GWMalomoButton extends HTMLElement {
    constructor() {
      super()
      this.trackingPageUrl = this.getAttribute('tracking-page-url')
      this.orderId = this.getAttribute('order-id')
    }

    connectedCallback() {
      this._initMalomoButton()
    }

    async _initMalomoButton() {
      const response = await GWUtils.request(
        GWCA.ENDPOINTS.MISC.GET_MALOMO_ORDER,
        {
          orderID: this.orderId,
        }
      )

      if (response.error) {
        console.error(response.error)
        return
      }

      if (response.order?.url) {
        const trackingLink = this.querySelector('a')
        trackingLink.href = response.order.url
      } else {
        this.remove()
      }
    }
  }
)

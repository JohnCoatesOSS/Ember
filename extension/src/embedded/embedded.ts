import * as Everlane from "../shared/Models/Sites/Everlane"
import * as EverlaneSizing from "../shared/Data/EverlaneSizingData"
import { Measurement, fractionToFloat, cmToInches, SizedMeasurements, Measurements, MeasurementLabel } from "../shared/Models/Measurements"
import { Recommendation } from "../shared/Controllers/Recommendation"
import { EmberMeasurements, EmberMessage, EmberMessageType } from "../shared/Models/Communication/MessagePassing"

class Ember {
  static shared: Ember;

  log: (...data: any[]) => void;

  xhr_open: (method: string, url: string, async: boolean, username?: string | null, password?: string | null) => void;
  xhr: XHR

  shouldClickRecommendedSize = true

  constructor() {
    this.log = Ember.log()
    // this.subscribeToEventListeners()
    this.startObservingBody()
    this.injectStylesheet()

    this.xhr_open = window.XMLHttpRequest.prototype.open
    this.xhr = window.XMLHttpRequest
    window.XMLHttpRequest.prototype.open = Ember.xhr_intercept_open as any
  }

  subscribeToEventListeners() {
    window.addEventListener("DOMContentLoaded", this.onDomContentLoaded.bind(this));
    document.addEventListener("readystatechange", this.onReadyStateChange.bind(this));
    this.log("adding event listeners")
  }

  // MARK: - Log

  static log(): (...data: any[]) => void {
    let body = document.body
    var log: (...data: any[]) => void

    if (!body) {
      log = window.console.log  
    } else {
      let iframe = document.createElement("iframe")
      iframe.hidden = true
      body.appendChild(iframe)
      let iframeWindow = iframe.contentWindow as Window & typeof globalThis
      log = iframeWindow.console.log
    }
    
    return function (...data: any[]) {
      log.apply(null, ["﹥"].concat(Array.from(arguments)))
    }
  }

  // MARK: - Size Highlighting

  sizeSelector: HTMLElement | null = null
  selectedElement: HTMLElement | null = null
  recommendedSize: string | null = null

  startObservingSizeSelector() {
    let sizeSelector = document.querySelector(".product-page__size-selector") as HTMLElement || null
    if (!sizeSelector) { return }
    this.attachToNewSizeSelector(sizeSelector)
  }

  attachToNewSizeSelector(sizeSelector: HTMLElement) {
    this.sizeSelector = sizeSelector
    this.higlightRecommendedSize()
    
    this.observe(sizeSelector, this.sizeSelectorMutation.bind(this))
  }

  recommendedSizes = new Map<string, string>()
  higlightRecommendedSize() {
    const sizeSelector = this.sizeSelector
    if (!sizeSelector) { return }

    let productName = this.getCurrentProductName()
    if (!productName) { return }

    let color = this.getCurrentColor()
    if (!color) { return }

    let product = this.getProduct(productName, color)
    if (!product) {
      this.log("No matching product", productName, color)
      return
    }

    const key = productName + color
    let memoizedRecommended = this.recommendedSizes.get(key)
    if (memoizedRecommended) {
      this.doHighlight(memoizedRecommended, sizeSelector)
      return
    }

    const self = this
    this.recommendedSizeForProduct(product, recommendedSize => {
      if (!recommendedSize) { return }
      self.recommendedSizes.set(key, recommendedSize)
      self.doHighlight(recommendedSize, sizeSelector)
    })
  }
  
  doHighlight(recommendedSize: string, sizeSelector: HTMLElement) {
    let children = Array.from(sizeSelector.children)
    let self = this
    children.forEach(element => {
      let htmlElement = element as HTMLElement
      let size = htmlElement.innerText
      if (size != recommendedSize) {
        if (self.shouldClickRecommendedSize) {
          htmlElement.addEventListener("click", () => {
            self.shouldClickRecommendedSize = false   
          })
        }
        return
      }

      if (htmlElement.classList.contains("ember_selected")) { return }
      htmlElement.classList.add("ember_selected")
      this.selectedElement = htmlElement

      if (self.shouldClickRecommendedSize && !htmlElement.classList.contains("product-page__size-selection--selected")) {
        htmlElement.click()
      }

      let selectedSizeLabel = document.querySelector(".product-page__selected-size-name") as HTMLElement || null
      if (selectedSizeLabel) {
        selectedSizeLabel.innerText = "Sized by Ember"
      }

      let sizeGuide = document.querySelector(".product-page__fit-guide") as HTMLElement || null
      if (sizeGuide && !document.getElementById("ember-learn-more")) {
        let learnMore = document.createElement("button");
        learnMore.id = "ember-learn-more"
        learnMore.innerHTML = "Learn More";
        learnMore.classList.value = "everlane-brand-link"
        learnMore.style.display = "block"
        learnMore.style.textDecoration = "underline"
        
        let parent = sizeGuide.parentNode
        if (parent) {
          parent.insertBefore(learnMore, sizeGuide)
        }
      }
      
    })
  }

  getCurrentProductName(): string | undefined {
    let element = document.querySelector("h1[class='product-heading__name'] > span")
    if (!element) { return undefined }
    let htmlElement = element as HTMLElement
    return htmlElement.innerText
  }

  getCurrentColor(): string | undefined {
    let element = document.querySelector("span.product-page__color-name--selected")
    if (!element) { return undefined }
    let htmlElement = element as HTMLElement
    return htmlElement.innerText
  }

  sizeSelectorMutation(records: MutationRecord[], observer: MutationObserver) {
    records.forEach( record => {
      if (record.type == "attributes") {
        this.ensuresSlectedElementHasSelectedAttribute()
        return
      }
      if (record.type != "childList") { return }
      this.higlightRecommendedSize()
    })
  }

  ensuresSlectedElementHasSelectedAttribute() {
    let element = this.selectedElement
    if (!element) { return }
    if (element.classList.contains("ember_selected")) { return }
    element.classList.add("ember_selected")
  }

  // MARK: - Body Mutations

  startObservingBody() {
    if (!document.documentElement) {
      console.log("No body to observe")
      return
    }
    this.observe(document.documentElement, this.bodyMutation.bind(this))
  }

  bodyMutation(records: MutationRecord[], observer: MutationObserver) {
    var childListMutation = false
    records.forEach( record => {
      if (record.type != "childList") { return }
      childListMutation = true
    })

    if (childListMutation == false) { return }

    let sizeSelector = document.querySelector(".product-page__size-selector") as HTMLElement || null
    if (!sizeSelector) { return }

    if (sizeSelector === this.sizeSelector) { return }

    this.attachToNewSizeSelector(sizeSelector)
  }

  // MARK: - Observing

  observe(target: Node, callback: MutationCallback) {
    const options = {
      childList: true,
      attributes: true,
      subtree: true 
    }

    const observer = new MutationObserver(callback);
    observer.observe(target, options);
  }

  // MARK: - Stylesheet

  injectStylesheet() {
    const stylesheet = new CSSStyleSheet();
    stylesheet.addRule(".ember_hidden", "display: none")
    stylesheet.addRule(".ember_selected", "border: 2px solid #4F1A83");
    (document as DocumentInternal).adoptedStyleSheets = [stylesheet]
  }

  // MARK: - Intercepts

  static xhr_intercept_open(this: XMLHttpRequest, method: string, url: string, async?: boolean, username?: string | null, password?: string | null) {
    if (url.startsWith("/api/v2/product_groups?product_permalink")) {
      this.addEventListener('load', function(this: XMLHttpRequest) {
          Ember.shared.productGroupLoaded(url, this.responseText)
      });
    }

    Ember.shared.xhr_open.apply(this, arguments as any);
  }

  products: Everlane.Product[] = []
  productGroupLoaded(url: string, responseText: string) {
    this.shouldClickRecommendedSize = true
    let response = JSON.parse(responseText) as Everlane.ProductGroupsResponse
    this.log('loaded', url, response);
    
    let self = this
    response.products.forEach( product => {
      self.ingestProduct(product)
    });

    this.products = response.products
   
    // let measurements = this.sizeChartForProduct(response.products[0])
    // this.log("measurements", measurements)
    // this.getRecommendation("mens-tees", measurements)
  }

  getProduct(name: string, color: string): Everlane.Product | undefined {
    var matchingProduct: Everlane.Product | undefined
    this.products.forEach(product => {
      if (product.display_name != name) { return }
      if (product.color.name != color) { return }
      matchingProduct = product
    })

    return matchingProduct
  }

  recommendedSizeForProduct(product: Everlane.Product, callback: (recommendedSize: string | undefined) => void) {
    let measurements = this.sizeChartForProduct(product)
    let collection = product.primary_collection.permalink
    this.getRecommendation(collection, measurements, callback)
  }

  ingestProduct(product: Everlane.Product)  {
    // this.log("product", product)
    this.readSku(product.product_sku)
  }

  // string: permalink
  sizeCharts: Map<string, Everlane.SizedMeasurements> = new Map<string, Everlane.SizedMeasurements>();
  sizeChartForProduct(product: Everlane.Product): Everlane.SizedMeasurements {
    let memoized = this.sizeCharts.get(product.permalink)
    if (memoized) {
      return memoized
    }

    let sizeChart = JSON.parse(product.size_chart.content) as Array<string[]>
    var measurements: Everlane.SizedMeasurements = {}

    var sizes: string[] | null = null
    sizeChart.forEach( (array) => {
      if (array.length == 0) { return }
      let first = array.shift()
      if (!first) { return }

      if (first == "POINT OF MEASURE") {
        sizes = array
        return
      }

      if (!sizes) {
        this.log("Skipping measurements because we're missing sizes")
        return
      }
      let localSizes = sizes as string[]

      let label: string
      if (first.indexOf("Garment: ") != -1) {
        label = first.split("Garment: ")[1].trim()
      } else {
        label = first.trim()
      }

      this.log(label, array)

      array.forEach((inches, index) =>  {
        let size = localSizes[index]
        var sizeMeasurements: Everlane.Measurement[] = measurements[size] ?? []
        if (Everlane.MeasurementLabel.isMember(label) == false) { return }

        let inchesNumber = fractionToFloat(inches)
        sizeMeasurements.push({
          label: Everlane.MeasurementLabel.fromLabel(label, inchesNumber),
          inches: inchesNumber
        })

        measurements[size] = sizeMeasurements
      })
    })

    this.sizeCharts.set(product.permalink, measurements)
    return measurements
  }

  readSku(sku: string) {
    var skuParts = sku.split("-")
    this.log("sku", sku, "parts", skuParts)
    let gender = skuParts.shift() ?? ""
    let collection = skuParts.shift() ?? ""
    let fabric = skuParts.shift() ?? ""
    let item = skuParts.shift() ?? ""
    let modifier = skuParts.shift() ?? ""
    let color = skuParts.shift() ?? ""

    this.log("collection", collection, "item", item, "modifier", modifier, "color", color)
  }

  getRecommendation(collectionName: string, sizeChart: Everlane.SizedMeasurements, callback: (recommendedSize: string | undefined) => void) {
    let collection = EverlaneSizing.Collections.collectionNamed(collectionName)
    if (!collection) { 
      this.log(`Couldn't find collection named ${collectionName}`)
      return
    }

    let self = this
    this.getUserMeasurements((measurements) => {
      self.recommendSizeWithMeasurements(measurements, collectionName, sizeChart, callback)
    })
  }

  recommendSizeWithMeasurements(measurements: Measurements | undefined, collectionName: string, sizeChart: Everlane.SizedMeasurements, callback: (recommendedSize: string | undefined) => void) {
    if (!measurements) {
      console.log("Invalid measurements", measurements)
      callback(undefined)
      return
    }
    console.log("received user measurements", measurements)

    var list: Everlane.Measurement[] = []

    Object.entries(measurements).forEach(([labelUntyped, value]) => {
      let labels = Everlane.MeasurementLabel.convert(labelUntyped as MeasurementLabel)
      labels.forEach(label => {
        let measurement: Everlane.Measurement = {
          label: label,
          inches: value
        }
        list.push(measurement)
      })
    })

    let recommended = Recommendation.sizeForCollection(collectionName, list, sizeChart)
    if (!recommended) {
      console.log("Failed to get recommended size")
      callback(undefined)
      return
    }

    callback(recommended)
  }

  getUserMeasurements(callback: (measurements: Measurements | undefined) => void) {
    let identifierElement = document.getElementById("ember-identifier")
    if (!identifierElement) {
      this.log("Couldn't find ember-identifier element")
      return
    }

    let extensionId = identifierElement.getAttribute("identifier")
    if (!extensionId) {
      this.log("Ember-identifier missing extension identifier")
      return
    }

    const log = this.log.bind(this)
    chrome.runtime.sendMessage(extensionId, {objectExample: "value"},
      function(response: EmberMeasurements) {
        log("response from extension!", response)
        callback(response.measurements)
          // handleError(url);
      });

      // let message: EmberMessage = {
      //   ember: true,
      //   type: EmberMessageType.GetMeasurements
      // }
      // window.postMessage(message, "*");
  }

  // MARK: - Subscriptions

  onDomContentLoaded(event: Event) {
    this.log("DOMContentLoaded");
  }

  onReadyStateChange(event: Event) {
    this.log("document.readyState", document.readyState);
    if (document.readyState != "complete") {
          return;
    }
    this.startObservingSizeSelector()
    this.startObservingBody()
  }
}

Ember.shared = new Ember()

// MARK: - Interface Extensions

interface DocumentInternal extends Document {
  adoptedStyleSheets: CSSStyleSheet[];
}

// MARK: - Private Interfaces

interface XHR {
  new (): XMLHttpRequest;
  prototype: XMLHttpRequest;
  readonly DONE: number;
  readonly HEADERS_RECEIVED: number;
  readonly LOADING: number;
  readonly OPENED: number;
  readonly UNSENT: number;
}
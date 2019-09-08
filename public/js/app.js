(function() {
    let _gridContainer,
        _inputSearchBox,
        _gridContainerDiv,
        _mainContainerDiv,
        _currentOffset = 0;

    const ENTER_KEY = 13,
          API_KEY = 'GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw',
          OFFSET_INCREMENT = 10,
          ROOT_URL = `http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}`;

    function InputSearchComponent() {
        let _term;

        let renderSearchBox = function() {
            let inputDiv = window.document.createElement("div");
            inputDiv.className = "input-group-append pointer-cursor";

            let inputButton = window.document.createElement("span");
            inputButton.className = "input-group-text";
            inputButton.innerText = "Search";
            inputButton.addEventListener("click", function() {
                _currentOffset = 0;
                fetchImageResults(_term, _currentOffset);
            });

            inputDiv.appendChild(inputButton);

            return inputDiv;
        };

        let renderInput = function() {
            let inputElement = window.document.createElement("input");
            inputElement.className = "form-control";
            inputElement.setAttribute("placeholder", "Enter a search term");
            inputElement.setAttribute("aria-label", "Search");
            inputElement.addEventListener("keyup", function(e) {
                if(e.keyCode === ENTER_KEY){
                    _currentOffset = 0;
                    fetchImageResults(_term, _currentOffset);
                } else {
                    _term = e.target.value;
                }
            });

            return inputElement;
        };

        this.renderContainer = function(){
            let inputDiv = window.document.createElement("div");
            inputDiv.classList = "input-group mt-2";

            inputDiv.appendChild(renderInput());
            inputDiv.appendChild(renderSearchBox());
            _mainContainerDiv.appendChild(inputDiv);
        };

        this.getTerm = function() {
            return _term;
        };
    }

    function ImageGridComponent(){
        this.renderContainer = function(json) {
            renderResults(json);
        };

        let renderResults = function(json) {
            clearResults();

            let jsonDataArr = json.data,
                resultsFrag = window.document.createDocumentFragment();

            for(let i=0; i<jsonDataArr.length; i++) {
                let imgObject = jsonDataArr[i],
                    {images} = imgObject;

                createImage(images, resultsFrag);
            }

            _gridContainerDiv.appendChild(resultsFrag);

            let pageNav = window.document.getElementById("nav-list");
            pageNav.classList.remove("invisible");
        };

        let clearResults = function() {
            while (_gridContainerDiv.firstChild) {
                _gridContainerDiv.firstChild.remove();
            }
        };

        let createImage = function(imageData, resultsFrag) {
            let img = window.document.createElement("img");
            const stillImageData = imageData.fixed_width_still,
                  {url, width, height} = stillImageData;

            img.setAttribute("src", url);
            img.setAttribute("width", width);
            img.setAttribute("height", height);
            img.setAttribute("data-toggle", "modal");
            img.setAttribute("data-target", "#image-modal");
            img.setAttribute("data-modal-url", imageData.original.url);
            img.addEventListener("mouseover", function() {
                this.src = imageData.fixed_width.url;
            });
            img.addEventListener("mouseout", function() {
                this.src = imageData.fixed_width_still.url;
            });
            img.className = "mt-2";

            resultsFrag.appendChild(img);
        };

        let init = function(){
            _gridContainerDiv = window.document.createElement("div");
            _gridContainerDiv.setAttribute("id", "row-results");
            _gridContainerDiv.className = "row-wrapped-results mt-3";
            _mainContainerDiv.appendChild(_gridContainerDiv);
        };

        init();
    }

    function ImageModalContainer() {
        this.renderContainer = function(){
            let modalDiv = window.document.createElement("div");
            modalDiv.classList="modal fade";
            modalDiv.setAttribute("id", "image-modal");
            modalDiv.setAttribute("tabindex", "-1");
            modalDiv.setAttribute("role", "dialog");

            renderDocument(modalDiv);
            _mainContainerDiv.appendChild(modalDiv);
        };

        let renderDocument = function(modalDiv) {
            let modalDocumentDiv = window.document.createElement("div");
            modalDocumentDiv.classList="modal-dialog modal-dialog-centered";
            modalDocumentDiv.setAttribute("role", "document");

            let modalContentDiv = window.document.createElement("div");
            modalContentDiv.className="modal-content";

            renderHeader(modalContentDiv);
            renderBody(modalContentDiv);

            modalDocumentDiv.appendChild(modalContentDiv);
            modalDiv.appendChild(modalDocumentDiv);
        };

        let renderHeader = function(contentDiv) {
            let closeButton = window.document.createElement("button");
            closeButton.className="close";
            closeButton.setAttribute("data-dismiss", "modal");
            closeButton.setAttribute("aria-label", "Close");

            let closeButtonSpan = window.document.createElement("span");
            closeButtonSpan.setAttribute("aria-hidden", "true");
            closeButtonSpan.textContent = 'x';
            closeButton.appendChild(closeButtonSpan);

            let modalHeaderDiv = window.document.createElement("div");
            modalHeaderDiv.classList="modal-header pb-2 pt-2";
            modalHeaderDiv.appendChild(closeButton);

            contentDiv.appendChild(modalHeaderDiv);
        };

        let renderBody = function(contentDiv) {
            let modalBodyDiv = window.document.createElement("div");
            modalBodyDiv.setAttribute("id", "modal-body-content");
            modalBodyDiv.classList = "modal-body d-flex justify-content-center pt-2";

            let imageElt = window.document.createElement("img");
            imageElt.setAttribute("id", "modal-body-image");
            imageElt.className = "mw-100";
            modalBodyDiv.appendChild(imageElt);

            contentDiv.appendChild(modalBodyDiv);
        };
    }

    function PaginationContainer(){
        //modeled based on this example:
        //https://getbootstrap.com/docs/4.0/components/pagination/#working-with-icons

        this.renderContainer = function() {
            let navList = window.document.createElement("nav");
            navList.setAttribute("id", "nav-list");
            navList.setAttribute("aria-label", "Page navigation example");
            navList.classList="d-flex justify-content-center mt-2 invisible fixed-footer";

            let unorderedList = window.document.createElement("ul");
            unorderedList.classList = "pagination pagination-lg";

            renderNavItems(unorderedList);
            navList.append(unorderedList);
            _mainContainerDiv.appendChild(navList);

        };

        let renderNavItems = function(listElt) {
            renderNavItem(listElt, '\u00ab', "Previous", function() {
                if(_currentOffset < OFFSET_INCREMENT) {
                    return;
                }

                let term = _inputSearchBox.getTerm();
                _currentOffset -= OFFSET_INCREMENT;
                fetchImageResults(term, _currentOffset);
            });
            renderNavItem(listElt, '\u00bb', "Next", function() {
                let term = _inputSearchBox.getTerm();
                _currentOffset += OFFSET_INCREMENT;
                fetchImageResults(term, _currentOffset);
            });
        };

        let renderNavItem = function(parentListElt, displayText, textValue, clickCallback) {
            let listItem = window.document.createElement("li");
            listItem.className = "page-item";
            listItem.addEventListener("click", clickCallback);

            let anchorItem = window.document.createElement("a");
            anchorItem.className = "page-link";
            anchorItem.setAttribute("href","#");
            anchorItem.setAttribute("aria-label", textValue);

            let spanItem = window.document.createElement("span");
            spanItem.setAttribute("aria-hidden","true");
            spanItem.textContent = displayText;
            anchorItem.appendChild(spanItem);

            let textItem = window.document.createElement("span");
            textItem.className = "sr-only";
            textItem.textContent = textValue;
            anchorItem.appendChild(textItem);

            listItem.appendChild(anchorItem);
            parentListElt.append(listItem);
        };
    }

    let fetchImageResults = function(term, offset=0) {
        const url = `${ROOT_URL}&q=${term}&offset=${offset}&limit=${OFFSET_INCREMENT}`;
        fetch(url).then(function(response) {
          return response.json();
        }).then(function(myJson) {
            _gridContainer.renderContainer(myJson);
        });
    };

    let init = function() {
        _mainContainerDiv = window.document.getElementById("main");

        _inputSearchBox = new InputSearchComponent();
        _inputSearchBox.renderContainer();

        _gridContainer = new ImageGridComponent();

        let paginationComponent = new PaginationContainer();
        paginationComponent.renderContainer();

        let modalContainer = new ImageModalContainer();
        modalContainer.renderContainer();

        //load image before modal is shown.
        //https://getbootstrap.com/docs/4.0/components/modal/#varying-modal-content
        $('#image-modal').on('show.bs.modal', function (event) {
            let image = event.relatedTarget,
                modalUrl = image.dataset.modalUrl,
                modalBodyImage = window.document.getElementById("modal-body-image");

            modalBodyImage.src = modalUrl;
        });
    };

    init();
})();
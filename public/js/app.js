(function() {
    let _mainContainerDiv,
        _gridContainer,
        _gridContainerDiv;

    const ENTER_KEY = 13,
          API_KEY = 'GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw',
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
                fetchImageResults(_term);
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
                    fetchImageResults(_term);
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
    }

    function ImageGridComponent(){
        this.renderContainer = function(json) {
            renderResults(json);
        };

        let renderResults = function(json) {
            clearResults();

            let jsonDataArr = json.data;
            for(let i=0; i<jsonDataArr.length; i++) {
                let imgObject = jsonDataArr[i],
                    {images} = imgObject;

                createImage(images);
            }
        };

        let clearResults = function() {
            while (_gridContainerDiv.firstChild) {
                _gridContainerDiv.firstChild.remove();
            }
        }

        let createImage = function(imageData) {
            let img = window.document.createElement("img");
            img.setAttribute("src", imageData.fixed_width_still.url);
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

            _gridContainerDiv.appendChild(img);
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

    let fetchImageResults = function(term) {
        const url = `${ROOT_URL}&q=${term}`;
        fetch(url).then(function(response) {
          return response.json();
        }).then(function(myJson) {
            _gridContainer.renderContainer(myJson);
        });
    };

    let init = function() {
        _mainContainerDiv = window.document.getElementById("main");

        let inputSearchBox = new InputSearchComponent();
        inputSearchBox.renderContainer();

        _gridContainer = new ImageGridComponent();

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
    }

    init();
})();
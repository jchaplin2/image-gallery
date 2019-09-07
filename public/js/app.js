(function() {
    let _mainContainer;
    const ENTER_KEY = 13,
          API_KEY = 'GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw',
          ROOT_URL = `http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}`;

    function InputSearchComponent() {
        let _term;

        let renderSearchBox = function() {
            let inputDiv = window.document.createElement("div");
            inputDiv.className = "input-group-append";

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
            _mainContainer.appendChild(inputDiv);
        };
    }

    let fetchImageResults = function(term) {
        const url = `${ROOT_URL}&q=${term}`;
        fetch(url).then(function(response) {
          return response.json();
        }).then(function(myJson) {
          console.log(JSON.stringify(myJson));
        });
    };

    let init = function() {
        _mainContainer = window.document.getElementById("main");

        let inputSearchBox = new InputSearchComponent();
        inputSearchBox.renderContainer();
    }

    init();
})();
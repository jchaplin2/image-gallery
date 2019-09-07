(function() {
    let _mainContainer;
    const ENTER_KEY = 13;

    function InputSearchComponent() {
        let renderSearchBox = function() {
            let inputDiv = window.document.createElement("div");
            inputDiv.className = "input-group-append";

            let inputButton = window.document.createElement("span");
            inputButton.className = "input-group-text";
            inputButton.innerText = "Search";
            inputButton.addEventListener("click", fetchImageResults);

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
                    fetchImageResults();
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

    let fetchImageResults = function() {
        console.log("call fetch here.");
    };

    let init = function() {
        _mainContainer = window.document.getElementById("main");

        let inputSearchBox = new InputSearchComponent();
        inputSearchBox.renderContainer();
    }

    init();
})();
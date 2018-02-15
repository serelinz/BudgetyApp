//budget controller
var budgetController = (function () {
    
    //constructor 
    var Expense = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var Income = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp:0,
            inc:0
        }  
    };

    return {
        addItem : function (type, des, val) {
            var newItem,ID;

            //ID = last ID + 1
            //create new ID
            if (data.allItems[type].length >0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else {
                ID= 0;
            }
            
            //create new item based on type
            if (type === 'exp'){
                newItem = new Expense (ID, des, val);
            }else if (type === 'inc'){
                newItem = new Income (ID, des, val);
            }
            
            //push it into data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;

        }
    };

})();

//UI controller
var UIController = (function(){
    
    var DOMstrings = {
       inputType: '.add__type',
       inputDescription : '.add__description',
       inputValue : '.add__value',
       inputButton : '.add__btn',
       incomeContainer : '.income__list',
       expensesContainer : '.expenses__list',
    };

    //a pulich function/method
    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,//will be either inc exp 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value,
            };   
        },

        addListItem: function(obj,type){
            var html, newHtml, element;

            //create html string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace ('%description%', obj.description);
            newHtml = newHtml.replace ('%value%', obj.value);

            //add html to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

   
        },

        clearFields: function() {
            var fields, fieldArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription+ ',' + DOMstrings.inputValue);
            
            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (current, index, array) {
                current.value = '';

                
            });
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

//global app controller ,combine budgetController and UIController
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
             if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
             }
        });
    };

   

    var ctrlAddItem = function () {
        var input, newItem;
        
        // get the filed input data
        input = UICtrl.getInput();

        //add the item to the budget controler
        newItem = budgetCtrl.addItem(input.type, input.description,input.value);
        
        //add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        //clear the filed
        UICtrl.clearFields();
        
        //calculate the budget
        
        //display the budget on the UI
    };
    
    return {
        init: function () {
            console.log('application has started');
            setupEventListeners();
        }
    };
    

})(budgetController,UIController);

controller.init();
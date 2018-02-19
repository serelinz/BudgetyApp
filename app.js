//budget controller
var budgetController = (function () {
    
    //constructor 
    var Expense = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if(totalIncome >0) {
            this.percentage = Math.round((this.value / totalIncome) *100);

        }else {
            this.percentage = -1;
        }
      
    };

    Expense.prototype.getPercentages = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var caculateTotal = function (type) {
       var sum = 0;
       data.allItems[type].forEach(function(current){
            sum += current.value;
       });

       data.totals[type] = sum;

    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp:0,
            inc:0
        },
        budeget: 0,
        percentage: -1,
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
        },

        deleteItem: function (type, id) {
            var ids, index ;
            ids = data.allItems[type].map(function(current){
                return current.id;     
            });

            index = ids.indexOf(id);

            //remoce by index of the ID

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }


        },

        caculateBudget : function () {

            //caculate total income and expenses
            caculateTotal('exp');
            caculateTotal('inc');
            //caculate the budget : income - expenese
            data.budget = data.totals.inc - data.totals.exp;
            //caculate the % of income we spent 
            if(data.totals.inc > 0){
             data.percentage = Math.round((data.totals.exp/ data.totals.inc) * 100) ;
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentage: function() {

          var allPercentage = data.allItems.exp.map(function(cur) {
              return cur.getPercentages();
          });
          return allPercentage;
        },

        getBudget: function () {
            return {
                budeget :data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            };

        },

        testing: function () {
            console.log(data);
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
       budegetLabel : '.budget__value',
       incomeLabel : '.budget__income--value',
       expenseLabel : '.budget__expenses--value',
       percentageLabel : '.budget__expenses--percentage',
       container : '.container',
       expensesPercLabel: '.item__percentage',
       dateLabel :'.budget__title--month'
    };

    var formatNumber = function (num, type) {
        // + or - before number 

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length >3){
           int = int.substr(0, int.length - 3) + ',' +int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ?  '-' : '+') + ' ' + int + '.'+ dec;
    };

    var nodeListForEach = function(list, callback){
        for (var i=0; i<list.length; i++){
            callback(list[i],i);
        }
    };

    //a pulich function/method
    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,//will be either inc exp 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };   
        },

        addListItem: function(obj,type){
            var html, newHtml, element;

            //create html string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace ('%description%', obj.description);
            newHtml = newHtml.replace ('%value%', formatNumber(obj.value,type));

            //add html to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

   
        },

        deleteListItem: function(selectorID) {
            var element = document.getElementById(selectorID);

            element.parentNode.removeChild(element);

        },

        clearFields: function() {
            var fields, fieldArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription+ ',' + DOMstrings.inputValue);
            
            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldArr[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budeget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budegetLabel).textContent = formatNumber(obj.budeget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields,function(current,index){

                if(percentages[index]>0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now,month, months,year;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year;
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');

        },

        

        getDOMstrings: function() {
            return DOMstrings;
        },
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

        document.querySelector(DOM.container).addEventListener('click' ,ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {

        //calculate the budget
        budgetCtrl.caculateBudget();

        //return the budget
        var budeget = budgetCtrl.getBudget();
        
        //display the budget on the UI
        UICtrl.displayBudget(budeget);
    };

    var updatePercentages = function () {

        //caculate the %
        budgetCtrl.calculatePercentages();

        //read percentage from the budget controller
        var percentages = budgetCtrl.getPercentage();

        //update UI with the new percentages

        console.log(percentages);

        UICtrl.displayPercentages(percentages);
    };
   

    var ctrlAddItem = function () {
        var input, newItem;
        
        // 1. get the filed input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. add the item to the budget controler
            newItem = budgetCtrl.addItem(input.type, input.description,input.value);
                    
            //3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. clear the filed
            UICtrl.clearFields();
            
            //5. caculate and update budeget 
            updateBudget ();

            //6. caucalte and update the percentages
            updatePercentages();
        }   
        
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            //ID example : inc-1 ,exp-1

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt (splitID[1]);

            //1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. update and show the new budget
            updateBudget();

        }
        
    };
    
    return {
        init: function () {
            console.log('application has started');
            UICtrl.displayMonth();
            setupEventListeners();
            UICtrl.displayBudget({
                budeget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : 0
            });
        }
    };
    

})(budgetController,UIController);

controller.init();
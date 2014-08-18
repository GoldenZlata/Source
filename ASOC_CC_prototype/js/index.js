$(function () {

    var AppState = Backbone.Model.extend({
        defaults: {            
            state: "start"
        }
    });

    var appState = new AppState();
    
    


//добавить новое состояние: 1. написать template в index.html 2.добавить хэш-тэг и функцию-обработчик для него в контроллер .
//3.там же задать функцию-обработчик, которая создаст имя состояния в модели appState. 4. в представлении задать имя состояния 
//(которое будет браться из state) и template для него.
    var Controller = Backbone.Router.extend({
        routes: {
            "": "start", // Пустой hash-тэг
            "!/": "start", // Начальная страница
            "!/pnr": "pnr", // ввод SO
            "!/repair": "repair", // ввод SN
            "!/auth_main": "auth_main", //Блок авторизации
            "!/auth_confirm": "auth_confirm" //Блок подтверждения
        },
        start: function () {
            appState.set({ state: "start" });
        },
        pnr: function () {
            appState.set({ state: "pnr" });
        },
        repair: function () {
            appState.set({ state: "repair" });
        },
        auth_main: function() {
            appState.set({ state: "auth_main"});
        },
        auth_confirm: function() {
            appState.set({ state: "auth_confirm"});
        }
    });

    var controller = new Controller(); // Создаём контроллер


    var Block = Backbone.View.extend({
        el: $("#block"), // DOM элемент widget'а


        templates: { // Шаблоны на разные состояния
            "start": _.template($('#start').html()),
            "pnr": _.template($('#pnr').html()),
            "repair": _.template($('#repair').html()),
            "auth_main": _.template($('#auth_main').html()),
            "auth_confirm": _.template($('#auth_confirm').html())
        },

        events: {
            "click #startWorksButton": "pnr", // Обработчик клика на кнопке 
            "click #repairWorksButton": "repair", // Обработчик клика на кнопке 
            "click #repair_ok": "SN_check", // Обработчик клика на кнопке 
            "click #pnr_ok": "SO_check", // Обработчик клика на кнопке 
            "click #auth_ok": "phone_check"
        },

        initialize: function () { // Подписка на событие модели
            this.model.bind('change', this.render, this);
        },        


        pnr: function () {   //временно не нужный обработчик перехода по шаблону через events       
            appState.set({             // тут указать состояние, на которое нужно перейти
                state: "pnr"                
            });
        },
        repair: function () {
            appState.set({ state: "repair" });
        },
        SN_check: function() {            
            appState.set({ state: "auth_main"});
        },
        SO_check: function() {
            appState.set({ state: "auth_main"});
        },
        phone_check: function() {
            appState.set({ state: "auth_confirm"});
        },


        render: function () {
            var state = this.model.get("state");
            $(this.el).html(this.templates[state](this.model.toJSON()));
            return this;
        }
    });

    var block = new Block({ model: appState }); // создадим объект

    appState.trigger("change"); // Вызовем событие change у модели

    appState.bind("change:state", function () { // подписка на смену состояния для контроллера
        var state = this.get("state");
        if (state == "start")
            controller.navigate("!/", false); // false потому, что нам не надо 
                                              // вызывать обработчик у Router
        else
            controller.navigate("!/" + state, false);
    });

    Backbone.history.start();  // Запускаем HTML5 History push    


});
    
document.addEventListener('DOMContentLoaded', function() {
    var GeneratedSelectors = document.getElementsByClassName('register-elem generated');

    for(let i = 0; i < GeneratedSelectors.length; i++) {
        let Max             = GeneratedSelectors[i].getAttribute('max');
        let Min             = GeneratedSelectors[i].getAttribute('min');
        let Step            = GeneratedSelectors[i].getAttribute('step');
        let Abbreviation    = GeneratedSelectors[i].getAttribute('abbreviation');

        GenerateOptions(GeneratedSelectors[i], Max, Min, Step, Abbreviation);
    }

    function GenerateOptions(Selector, Max, Min, Step, Abbreviation) {
        Max     = parseInt(Max);
        Min     = parseInt(Min);
        Step    = parseInt(Step);

        for (let i = Min; i <= Max; i += Step) {
            let NewElem         = document.createElement("option");
            NewElem.innerHTML   = i + ' ' + Abbreviation;
            NewElem.value       = i;
            Selector.appendChild(NewElem);
        }
    }
})

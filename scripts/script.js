document.addEventListener('DOMContentLoaded', function() {

    var Form                    = document.getElementsByClassName('form-register')[0].reset();
    var DialogForms             = document.getElementsByClassName('dialog');
    var ButtonNext              = document.getElementsByClassName('main-button step-button')[0];
    var ButtonForm              = document.getElementsByClassName('main-button form-button')[0];
    var SelectorsCompany        = document.getElementsByClassName('company-required');
    var ButtonWhatsApp          = document.getElementById('whatsapp');
    var CompanyCheckBox         = document.getElementsByClassName('form-item system-for-connect');
    var TitleOfStep             = document.getElementById('secondary-title');
    var CountSteps              = document.getElementById('count-of-step');
    var StepOfRegister          = document.querySelectorAll('.step-of-register');
    var MaxNumberStep           = StepOfRegister.length;
    var InputsPhone             = document.getElementsByClassName('input phone');
    var Vacancy                 = document.getElementById('vac_select');
    var TruckSelectors          = document.getElementsByClassName('register-elem select generated truck');
    var SortedServices          = ['for-all'];
    var CurrentNumberStep       = 1;
    var SelectedServices        = [];
    var Region;
    var DriverLicense;
    var TaxiLicense;
    var CarYear;


    ButtonNext.addEventListener('click', NextStep);

    for (let i = 0; i < InputsPhone.length; i++) {
        InputsPhone[i].addEventListener('input', OnInputTel);
    } 

    Vacancy.addEventListener('change', function () {
        let DriverInfo = document.getElementsByClassName('form-item driver_info');
        let TruckForm = document.getElementsByClassName('form-item truck');
        let TruckMessage = document.getElementsByClassName('message_truck')[0];
        if (this.options[this.selectedIndex].value == 'сourier') {
            for (let i = 0; i < DriverInfo.length; i++) {
                DriverInfo[i].classList.remove('active');
                DriverInfo[i].getElementsByTagName('select')[0].required = false;
            }
        } else if (this.options[this.selectedIndex].value == 'truck-driver') {
            for (let j = 0; j < TruckSelectors.length; j++) {
                TruckSelectors[j].required = true;
                TruckSelectors[j].classList.add('required');
            }
            for (let i = 0; i < DriverInfo.length; i++) {
                DriverInfo[i].classList.add('active');
                DriverInfo[i].getElementsByTagName('select')[0].required = true;
            }
            for (let o = 0; o < TruckForm.length; o++) {
                TruckForm[o].classList.add('enabled');
            }
            TruckMessage.classList.remove('active');
        } else {
            for (let i = 0; i < DriverInfo.length; i++) {
                DriverInfo[i].classList.add('active');
                DriverInfo[i].getElementsByTagName('select')[0].required = true;
            }
        }
    });

    ButtonWhatsApp.addEventListener('change', function() {
        let CurrentWhatsAppInput    = document.getElementById(ButtonWhatsApp.id+'-input');
        if (ButtonWhatsApp.checked) {
            AddWhatsApp(CurrentWhatsAppInput);
        } else {
            RemoveWhatsApp(CurrentWhatsAppInput);
        }
    });

    for (let i = 0; i < SelectorsCompany.length; i++) {
        SelectorsCompany[i].addEventListener('change', ShowCompany);
    }

    for(let i = 0; i < CompanyCheckBox.length; i++) {
        CompanyCheckBox[i].addEventListener('change', GetMatchingDialogs);
    }


    function GetMatchingDialogs() {
        let Input = this.getElementsByTagName('input')[0];
        if (Input.checked && !SortedServices.includes(Input.id)) {
            SortedServices.push(Input.id);
        } else {
            for(let i = 0; i < SortedServices.length; i++) {
               if (SortedServices[i] == Input.id) {
                    SortedServices.splice(i, 1);
                }
            }
        }

        SortedServices.forEach(dialog => {
            for (let i = 0; i < DialogForms.length; i++) {
                if (DialogForms[i].classList.contains(dialog)) {
                    let Input = DialogForms[i].getElementsByTagName('input');

                    for (let j = 0; j < Input.length; j++) {
                        Input[j].addEventListener('change', function() {
                            this.required = true;
                            ReaderFile(this);
                        })
                    }
                }
            }
        })
    }

    function ShowCompany() {
        if (this.getAttribute('name') == 'region') {
            Region = this.value;
        } else if (this.getAttribute('name') == 'driver-license') {
            DriverLicense = this.value;
        } else if (this.getAttribute('name') == 'taxi-license') {
            TaxiLicense = this.value;
        } else {
            CarYear = this.value;
        }

        // Sedi
        if (Region == 'msk' || Region == 'spb') {
            if (!SelectedServices.includes('sedi')) {
                SelectedServices.push('sedi');
            }
        } else {
            for (let i = 0; i < SelectedServices.length; i++) {
                if (SelectedServices[i] == 'sedi') {
                    SelectedServices.splice(i, 1);
                }
            }
        }

        // Яндекс.Про Доставка
        if (DriverLicense !== 'oth') {
            if (!SelectedServices.includes('yandex-pro-delivery')) {
                SelectedServices.push('yandex-pro-delivery');
            }
        } else {
            for (let i = 0; i < SelectedServices.length; i++) {
                if (SelectedServices[i] == 'yandex-pro-delivery') {
                    SelectedServices.splice(i, 1);
                }
            }
        }

        // Яндекс.Про Такси 
        if (DriverLicense !== 'oth' || TaxiLicense == 'yes' && Region == 'msk') {
            if (!SelectedServices.includes('yandex-pro-taxi')) {
                SelectedServices.push('yandex-pro-taxi');
            }
        } else {
            for (let i = 0; i < SelectedServices.length; i++) {
                if (SelectedServices[i] == 'yandex-pro-taxi') {
                    SelectedServices.splice(i, 1);
                }
            }
        }

        // СитиМобил Доставка
        if (DriverLicense !== 'oth') {
            if (!SelectedServices.includes('city-mobil-delivery')) {
                SelectedServices.push('city-mobil-delivery');
            }
        } else {
            for (let i = 0; i < SelectedServices.length; i++) {
                if (SelectedServices[i] == 'city-mobil-delivery') {
                    SelectedServices.splice(i, 1);
                }
            }
        }

        // СитиМобил Такси
        if (Region == 'spb') {
            if (!SelectedServices.includes('city-mobil')) {
                SelectedServices.push('city-mobil');
            }
        } else {
            for (let i = 0; i < SelectedServices.length; i++) {
                if (SelectedServices[i] == 'city-mobil') {
                    SelectedServices.splice(i, 1);
                }
            }
        }

        // РБТ
        CarYearInt = parseInt(CarYear);
        if (Region == 'msk' || Region == 'spb' || DriverLicense !== 'oth' || CarYearInt >= 2013) {
            if (!SelectedServices.includes('rbt')) {
                SelectedServices.push('rbt');
            }
        } else {
            for (let i = 0; i < SelectedServices.length; i++) {
                if (SelectedServices[i] == 'rbt') {
                    SelectedServices.splice(i, 1);
                }
            }
        }

        for (let i = 0; i < CompanyCheckBox.length; i++) {
            SelectedServices.forEach(Service => {
                if (CompanyCheckBox[i].classList.contains(Service)) {
                    CompanyCheckBox[i].classList.add('active');
                }
            })
        }

    }

    function OnInputTel(e) {
        let InputTel = e.target;
        let InputTelValue = GetNumbersValue(InputTel);
        let FormattedInputValue = "";
        let FirstSymbols = "";
        
        if (!InputTelValue) {
            return InputTel.value = "";
        }

        if (["7", "8", "9"].indexOf(InputTelValue[0]) > -1 || InputTel.classList.contains('rus')) {
            FirstSymbols = (InputTelValue[0] == "8") ? "+7" : "+7";
            FormattedInputValue = InputTel.value = FirstSymbols + " ";
            if (InputTelValue.length > 1) {
                FormattedInputValue += '(' + InputTelValue.substring(1, 4);
            }
            if (InputTelValue.length >= 5) {
                FormattedInputValue += ') ' + InputTelValue.substring(4, 7);
            }
            if (InputTelValue.length >= 8) {
                FormattedInputValue += '-' + InputTelValue.substring(7, 9);
            }
            if (InputTelValue.length >= 10) {
                FormattedInputValue += '-' + InputTelValue.substring(9, 11);
            }
        } else {
            FirstSymbols = "+";
            FormattedInputValue = FirstSymbols + InputTelValue.substring(0, 16);            
        }

        InputTel.value = FormattedInputValue;
    }

    function GetNumbersValue(Input) {
        return Input.value.replace(/\D/g, '');
    }
    
    function SearchStep() {
        CheckButtons();
        StepOfRegister.forEach(item => {
            item.classList.remove('active');
            let NumberOfStep = item.getAttribute('count-of-step');
            if (NumberOfStep == CurrentNumberStep) {
                item.classList.add('active');
                TitleOfStep.innerHTML = item.getAttribute('name-of-step');
                CountSteps.innerHTML = CurrentNumberStep;
            }
        })
    }

    function NextStep() {
        if (CurrentNumberStep >= MaxNumberStep) {
            return false;
        } else {
            CheckingCompletedFields(CurrentNumberStep);
        }
    }

    function CheckButtons() {
        if (CurrentNumberStep == 5) {
            ButtonNext.classList.add('unactive');
        } else {
            ButtonForm.classList.add('unactive');
            ButtonNext.classList.remove('unactive');
        }
    }

    function RemoveWhatsApp(Checkbox) {
        Checkbox.required = false;
        Checkbox.parentElement.classList.remove('active');
    }

    function AddWhatsApp(Checkbox) {
        Checkbox.required = true;
        Checkbox.parentElement.classList.add('active');
    }

    function CheckingCompletedFields(NumberStep) { 
        let CurrentForm;
        let CheckError = "";
        let ClassError = "";

        StepOfRegister.forEach(item => {
            let NumberOfStep = item.getAttribute('count-of-step');
            if (NumberOfStep == NumberStep) {
                CurrentForm = item;
            }
        })

        let AllInputs = CurrentForm.getElementsByTagName('input');
        let AllSelectors = CurrentForm.getElementsByTagName('select');
        let AllRequiredElements = [];

        for (let i = 0; i < AllInputs.length; i++) {
            if (AllInputs[i].attributes.required) {
                AllRequiredElements.push(AllInputs[i]);
            }
        }

        for (let i = 0; i < AllSelectors.length; i++) {
            if (AllSelectors[i].attributes.required) {
                AllRequiredElements.push(AllSelectors[i]);
            }
        }

        for (let i = 0; i < AllRequiredElements.length; i++) {
            if (AllRequiredElements[i].value == "") {
                CheckError = true;
                ClassError = 'default';
            }
        }

        if (NumberStep == 2) {
            let PhoneInput= document.getElementsByClassName('input rus')[0];
            let WhatsAppInput = document.getElementsByClassName('input whatsapp')[0];

            if (PhoneInput.value.length < 18) {
                CheckError = true;
                ClassError = 'input';
            }

            if (WhatsAppInput.attributes.required) {
                let LengthValueWhatsApp = WhatsAppInput.value.length;
                if (LengthValueWhatsApp < 7 || LengthValueWhatsApp > 15) {
                    CheckError = true;
                    ClassError = 'input';
                }
            }
        }

        if (NumberStep == 4) {
            let CountCheckedInputs = 0;
            let ActiveInputs = [];

            for(let i = 0; i < AllInputs.length; i++) {
                if (AllInputs[i].parentNode.classList.contains('active')) {
                    ActiveInputs.push(AllInputs[i]);
                }
            }

            ActiveInputs.forEach(input => {
                if (input.checked) {
                    CountCheckedInputs++;
                }
            })

            if (CountCheckedInputs == 0) {
                CheckError = true;
                ClassError = 'checkboxes';
            }
        }

        if (CheckError == true && ClassError == 'default') {
            alert('Заполните все поля!');
            return false;
        } else if (CheckError == true && ClassError == 'checkboxes') {
            alert('Выберите любую из систем!');
            return false;
        } else if (CheckError == true && ClassError == 'input') {
            alert('Проверьте корректность ваших данных!');
            return false;
        } else {
            CurrentNumberStep++;
            SearchStep();
        } 
    }

    function ReaderFile(Input) {
        let Reader = new FileReader(),
            ReaderBase64 = new FileReader(),
            Image = Input.files[0],
            ImgElement = (Input.parentElement).nextElementSibling,
            ButtonText = (Input.nextElementSibling).getElementsByClassName('button_text')[0];

        Reader.onloadend = function() {
            let RealMimeType = getRealMimeType(Reader);
            if (RealMimeType !== 'unknown') {
                ReaderBase64.readAsDataURL(Image);
            } else {
                alert('Неизвестная ошибка');
                return false;
            }
        };

        Reader.readAsArrayBuffer(Image);

        ReaderBase64.onloadend = function() {
            let Base64 = this.result;
            ImgElement.setAttribute('src', Base64);
        }

        if (!ButtonText.classList.contains('loaded')) {
            ButtonText.innerText = 'Изменить фото';
            ButtonText.classList.add('loaded');
            setTimeout(ActiveNextMessage(Input), 1000);
    
        }
    }

    function ActiveNextMessage(CheckedInput) {
        let NextDialog = ((CheckedInput.parentNode).parentNode).parentNode.nextElementSibling;

        if (NextDialog != null) {

            if (CreatePreloader(NextDialog.parentNode, NextDialog)) {
                setTimeout(function() {
                    NextDialog.classList.add('active');
                    window.scrollTo({
                        left: 0,
                        top: document.body.scrollHeight,
                        behavior: "smooth"
                    });
                }, 1000);
            } else {
                return false;
            }

        } else {
            let RemoveService = ((CheckedInput.parentNode).parentNode).parentNode.parentNode;
            RemoveService = (RemoveService.className).replace('dialog ', '');

            for(let i = 0; i < SortedServices.length; i++) {
                if (SortedServices[i] == RemoveService) {
                    SortedServices.splice(i, 1);
                }
            }

            if (SortedServices.length != 0) {
                SortedServices.forEach(service => {
                    for(let i = 0; i < DialogForms.length; i++) {
                        if (DialogForms[i].classList.contains(service)) {
                            let ChildElement = DialogForms[i].getElementsByClassName('form-item')[0];
    
                            if (CreatePreloader(DialogForms[i], ChildElement)) {
                                setTimeout(function() {
                                    ChildElement.classList.add('active');
                                    window.scrollTo({
                                        left: 0,
                                        top: document.body.scrollHeight,
                                        behavior: "smooth"
                                    });
                                }, 1000);
                            }    
                        }
                    }
                })
            } else {
                setTimeout(function() {
                    ButtonForm.parentNode.classList.add('last-step');
                    ButtonForm.classList.remove('unactive');
                    window.scrollTo({
                        left: 0,
                        top: document.body.scrollHeight,
                        behavior: "smooth"
                    });
                }, 1000);
                return false;
            }
        }
    }

    function CreatePreloader(DialogItemParent, DialogItem) {
        let Preloader = document.createElement('div');
        let PreloaderImage = document.createElement('img');

        Preloader.classList.add('preloader');
        PreloaderImage.setAttribute('src', 'img/preloader.gif');

        Preloader.appendChild(PreloaderImage);
        DialogItemParent.insertBefore(Preloader, DialogItem);

        PreloaderImage.addEventListener('load', function() {
            window.scrollTo({
                left: 0,
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        });

        return setTimeout(function() {
            return DeletePreloader(Preloader);
        }, 1000);
    }

    function DeletePreloader(CurrentPreloader) {
        CurrentPreloader.remove();
        return true;
    }

    function getRealMimeType(reader) {
        let arr = (new Uint8Array(reader.result)).subarray(0, 4),
            header = '',
            realMimeType;
    
        for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }
    
        switch (header) {
            case "89504e47":
                realMimeType = "image/png";
                break;
            case "47494638":
                realMimeType = "image/gif";
                break;
            case "ffd8ffDB":
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
                realMimeType = "image/jpeg";
                break;
            default:
                realMimeType = "unknown";
                break;
        }
        
        return realMimeType;
    }

})
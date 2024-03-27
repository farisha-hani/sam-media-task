document.addEventListener("DOMContentLoaded", () => {

    // Call the function to get parameters
    const params = getUrlParams();

    let monster_img = document.getElementById("monster-img");
    let monster_text = document.getElementById("monster-text");

    //--------------------------------------------
    //     Display content based on parameter
    //--------------------------------------------
    if(params.type == "funny"){
        monster_img.classList.add("funny");
        monster_text.textContent = "You’ve got good sense of humour";"You’ve got good sense of humour";

    }else if(params.type == "romance"){
        monster_img.classList.add("romance");
        monster_text.textContent ="You’re so romantics";
    }

    //-------------------------------------
    //        To Allow only number
    //-------------------------------------
    let phoneNumberInput = document.getElementById('msisdn');

    // Check if the element exists before adding the event listener
    if (phoneNumberInput) {
        phoneNumberInput.addEventListener('input', function(event) {
            let inputValue = event.target.value;
            let sanitizedValue = '';

            // Remove any non-digit characters
            for (var i = 0; i < inputValue.length; i++) {
                if (!isNaN(parseInt(inputValue[i]))) {
                    sanitizedValue += inputValue[i];
                }
            }
            // Update the input value
            phoneNumberInput.value = sanitizedValue;
        });
    } else {
        console.error("Element with ID 'msisdn' not found.");
    }


    //-------------------------------------
    //        Submit phone number
    //-------------------------------------

    const subscribeForm = document.getElementById("subscribeForm");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let contact_no = document.getElementById("msisdn").value;
            if (validatePhoneNumber(contact_no)) {
                submitToSubscribe(contact_no);
            } else {
                Swal.fire({
                    title: "Invalid Phone number.",
                    icon: "warning"
                });
            }
        });
    } else {
        console.error("Element with ID 'subscribeForm' not found.");
    }

    //--------------------------------------------------------------------------------
    //        Automatically focus on the next input field once a digit is entered.
    //--------------------------------------------------------------------------------
    const inputs = document.querySelectorAll('input[name="pin_code_digit"]');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const value = event.target.value;
            if (isNaN(value)) {
                event.target.value = '';
                return;
            }

            if (value.length > 1) {
                event.target.value = value.slice(0, 1);
            }

            if (value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    input.blur(); // Blur the input field if it's the last one
                }
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && index > 0 && event.target.value === '') {
                inputs[index - 1].focus();
            }
        });
    });

    //-------------------------------------
    //        Validate Pin Number
    //-------------------------------------

    const pinForm = document.getElementById("pinForm");

    if (pinForm) {
        pinForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const inputs = document.querySelectorAll('input[name="pin_code_digit"]');
            let combinedValue = '';

            inputs.forEach(input => {
                combinedValue += input.value;
            });
    
            confirmPinCode(combinedValue, params.user_id, 'MY');
        });
    } else {
        console.error("Element with ID 'pinForm' not found.");
    }
});


//-------------------------------------------
//        Submit To Subscribe Function
//-------------------------------------------
function submitToSubscribe(phone_number){

    const element = document.getElementById("loader-wrapper");
    element.style.display = "flex";

    // Data to be sent in the first POST request
    const postData = {
        msisdn: phone_number,
        user_id: generateRandomString(),
        country: "MY"
    };
    // console.log(JSON.stringify(postData));

    // URL for the first POST request
    const url = 'https://0ct5ps.sse.codesandbox.io/api/v1/trigger-pin';
  
    // Configuring the fetch request
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
  
    // Sending the POST request
    fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
        //   console.log('POST request succeeded with JSON response', data);
        element.style.display = "none";
        Swal.fire({
            title: "Your pin code is " + data.pin,
            showDenyButton: false,
            showCancelButton: false,
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/pin.html?user_id="+data.user_id;
            }
        });
    })
    .catch(error => {
      console.error('There was a problem with the POST request', error);
    });

}

//-------------------------------------------
//        Confirm Pin Code Function
//-------------------------------------------
function confirmPinCode(pincode, id, country){

    const element = document.getElementById("loader-wrapper");
    element.style.display = "flex";
    
    // Data to be sent in the first POST request
    const postData = {
        pin: parseInt(pincode, 10),
        user_id: String(id),
        country: String(country)
    };
    // console.log(JSON.stringify(postData));

    // URL for the first POST request
    const url = 'https://0ct5ps.sse.codesandbox.io/api/v1/verify-pin';
  
    // Configuring the fetch request
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
  
    // Sending the POST request
    fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
        //   console.log('POST request succeeded with JSON response', data);
        element.style.display = "none";
        if(data.success == true){
            // console.log("true");
            // console.log("data.success: " + data.success);
            Swal.fire({
                title: "Your subscription is confirm!",
                showDenyButton: false,
                showCancelButton: false,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/thankyou.html";
                }
            });
        }else if(data.success == false) {
            // console.log("false");
            // console.log("data.success: " + data.success);
            Swal.fire({
                title: "Wrong PIN code!",
                icon: "warning"
            });
        }
    })
    .catch(error => {
      console.error('There was a problem with the POST request', error);
    });
}

//-------------------------------------------------------
//    Function to generate random string for user_id
//--------------------------------------------------------
function generateRandomString() {
    return Math.random().toString(36).substring(2, 10); // You can adjust the length as needed
}

//-------------------------------------
//    Function to get URL parameters
//-------------------------------------
function getUrlParams() {
    // Get the URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    // Initialize an object to store the parameters
    const params = {};
    // Iterate over each parameter and store it in the object
    for (const [key, value] of queryParams) {
        params[key] = value;
    }
    return params;
}

//-------------------------------------
//        Validate phone number
//-------------------------------------
function validatePhoneNumber(phoneNumber) {
    // Regular expression to match a valid phone number
    var phonePattern = /^0\d{9,10}$/;
    
    // Check if the phone number matches the pattern
    return phonePattern.test(phoneNumber);
}
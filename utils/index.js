let utils = {}

utils.apiFetch = async function (url) {
    console.log(url);
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage); // Throw an error with the response text
        }
    } catch (error) {
        console.log(error); // Log any errors caught during the fetch process
        if (error.message.toLowerCase().includes("not found")) {
            window.alert("Keyword Not Found. Try again.");
        }
    }
}

module.exports = utils;
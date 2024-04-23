import axios from "axios";

function clearLocalStorage() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
}

export async function testUser() {
    const token = localStorage.getItem("token");

    if (token) {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        try {
            const res = await axios.get(`${baseUrl}verifytoken`, { headers })
            if (res.status === 200) {
                console.log("User is signed in");
                return true;
            }
            else {
                clearLocalStorage();
                return false;
            }
        }
        catch (error) {
            clearLocalStorage();
            return false;
        }
    } else {
        clearLocalStorage();
        return false;
    }
}

export async function testAdmin() {
    const token = localStorage.getItem("adminToken");

    if (token) {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        try {
            const res = await axios.get(`${baseUrl}verifytoken`, { headers })
            if (res.status === 200) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            clearLocalStorage();
            return false;
        }
    } else {
        return false;
    }
}
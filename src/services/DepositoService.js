export const DepositoService = {

    getDepositosActivos: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdepos`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "activo": 1,
                },
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al obtener depositos activos: ", error);
            throw error;
        }
    },

    getDepositos: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdepos`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "activo": 0,
                },
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return response.json();

        } catch (error) {
            console.error("Error al obtener depositos: ", error);
            throw error;
        }
    },

    createDeposito: async (deposito) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdepos`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(deposito)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar crear el depósito: ", error);
            throw new Error("Error al intentar crear el depósito");
        }
    },

    updateDeposito: async (deposito) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stdepos`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(deposito)
            })

            if(!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    },

    deleteDeposito: async (deposito) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stdepos`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(deposito)
            })

            if(!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    }

}
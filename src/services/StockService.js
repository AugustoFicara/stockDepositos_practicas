export const StockService = {

    getStockActivos: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}ststock`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 3,
                },
            });

            /*if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }*/

            return await response.json();

        } catch (error) {
            console.error("Error al obtener stocks activos: ", error);
            throw error;
        }
    },
    
    getStock: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}ststock`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 0,
                },
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al obtener stock: ", error);
            throw error;
        }
    },

    createStock: async (stock) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}ststock`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(stock)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar agregar stock: ", error);
            throw new Error("Error al intentar agregar stock");
        }
    },

    updateStock: async (stock) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}ststock`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(stock)
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

    deleteStock: async (stock) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}ststock`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(stock)
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
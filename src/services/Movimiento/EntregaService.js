export const EntregaService = {

    /*buscarEmail: async (email) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 2,
                    "id": email,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el email: ", error);
            throw new Error("Error al intentar buscar el email");
        }
    },

    buscarCUIT: async (CUIT) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stdest`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 1,
                    "id": CUIT,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el cuit: ", error);
            throw new Error("Error al intentar buscar el cuit");
        }
    },*/

    getEntregas: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmoventr`, {
                mode: 'cors',
                method: 'GET',
                /*headers: {
                    "Content-Type": "application/json",
                    "buscar": 0,
                },*/
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al obtener entregas: ", error);
            throw error;
        }
    },

    createEntrega: async (entrega) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmoventr`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(entrega)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar crear la entrega: ", error);
            throw new Error("Error al intentar crear la entrega");
        }
    },

    updateEntrega: async (entrega) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stmoventr`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(entrega)
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

    deleteEntrega: async (entrega) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stmoventr`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(entrega)
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
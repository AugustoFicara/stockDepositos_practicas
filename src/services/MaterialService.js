export const MaterialService = {

    buscarNombreMaterial: async (nombreMaterial) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 1,
                    "id": nombreMaterial,
                },
            });

            
            /*if(!response.ok){
                throw new Error(await response.text());
            }*/

            return await response.json();

        } catch (error) {
            console.error("Error al intentar buscar el material: ", error);
            throw new Error("Error al intentar buscar el material");
        }
    },

    getMaterialesActivosStock: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
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
            console.error("Error al obtener materiales para stock: ", error);
            throw error;
        }
    },

    getMaterialesActivos: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "buscar": 2,
                },
            });

            if(!response.ok){
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al obtener materiales activos: ", error);
            throw error;
        }
    },
    
    getMateriales: async () => {
        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
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
            console.error("Error al obtener materiales: ", error);
            throw error;
        }
    },

    createMaterial: async (material) => {

        try {

            let response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(material)
                
            });

            
            if(!response.ok){
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error("Error al intentar crear el material: ", error);
            throw new Error("Error al intentar crear el material");
        }
    },

    updateMaterial: async (material) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
                mode: 'cors',
                method: 'PUT',
                body: JSON.stringify(material)
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

    deleteMaterial: async (material) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_URL}stmat`, {
                mode: 'cors',
                method: 'DELETE',
                body: JSON.stringify(material)
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
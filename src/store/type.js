import Type from './models/TypeModel'

export default ({
    state: {
        types: []
    },
    mutations: {
        loadTypes(state, payload) {
            // console.log(...payload.books)
            state.types = payload.types
        }
    },
    actions: {
        async loadTypes({ commit, getters }, payload) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const url = getters.baseRestApiUrl + '?controller=type&action=filter'
                const requestData = {
                    method: 'GET',
                    mode: 'cors'
                }
                const request = new Request(url, requestData)
                await fetch(request).then(function (response) {
                    return response.json()
                }).then(function (response) {
                    if (response.data) {
                        const typeArray = []
                        response.data.forEach(type => {
                            typeArray.push(
                                new Type(
                                    type.name,
                                    type.id
                                )
                            )
                        })
                        const payload = {
                            types: typeArray
                        }
                        // Send mutation
                        commit('loadTypes', payload)
                    }
                }).catch(function (e) {
                    console.log(e)
                })
                commit('setLoading', false)
            } catch (error) {
                commit('setLoading', false)
                commit('setError', error.message)
                throw error
            }
        }
    },
    getters: {
        types (state) {
          return state.types
        }, 
        searchTypes(state){
            return [state.types[0], state.types[1]]
        }
      }
})
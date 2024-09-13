import React from 'react'


const USER_CHAT = 'user-chat'
const StoreContext = React.createContext(null)

export const StoreProvider = ({children}) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        const val = localStorage.getItem(USER_CHAT)
        
        if (val) {
            (val.timestamp > Date.now()) ? console.log("expired") : console.log("not expired")
            setUser(JSON.parse(val))
        }
    }, [])

    React.useEffect(() => {
        if (user) {
            localStorage.setItem(USER_CHAT, JSON.stringify(user))
        } else {
            localStorage.removeItem(USER_CHAT)
        }
    }, [user])

    const logout = () => {
        localStorage.removeItem(USER_CHAT)
        setUser(null)
    }


    return (
        <StoreContext.Provider value={{user, setUser, logout}}>
            {children}
        </StoreContext.Provider>
    )
}

export default function useStore() { 
    const context = React.useContext(StoreContext)

    if (!context) {
        throw new Error('useStore must be used within a StoreProvider')
    }

    return context
 }

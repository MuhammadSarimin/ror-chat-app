import useStore from './AppStore'

export default function SetUser() {

    const { setUser } = useStore()

    const handleSubmit = (e) => {
        e.preventDefault();

        const d = new Date();
        d.setHours(d.getHours() + 1);

        setUser({
            user_id: Math.random().toString(36).substring(2, 15),
            user_name: e.target.name.value,
            timestamp: d.getTime()
        })
    }

  return (
    <main className='App flex flex-column items-center justify-center'>
        <h3>Nama dalam obrolan</h3>
        <form onSubmit={handleSubmit} className='set-user-form'>
        <input 
        className='set-user-input'
        type="text"
        placeholder='masukkan nama'
        name='name'
        />
        </form>

    </main>
  )
}

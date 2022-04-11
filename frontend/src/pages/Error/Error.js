import styles from "./Error.module.css"
export default function Error () {

  document.title= "Goldit - Error"

  return <div className={styles.container}>
    <h1 style={{"margin":"auto"}}>Whoops, something terrible happened</h1>
  </div>
}
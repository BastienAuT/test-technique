import CheckoutForm from "@/components/checkOutForm/CheckOutForm";
import styles from "./homepage.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <CheckoutForm />
    </div>
  );
}

import { createBrowserRouter, Navigate } from "react-router";
import { NotFound } from "./NotFound";

// --- PakiShip Customer Imports ---
import { CustomerHomePage } from "./PakiShip/pages/CustomerHomePage";
import { SendParcelPage } from "./PakiShip/PakiShipMain/Customer/SendParcelPage";
import { TrackPackagePage } from "./PakiShip/PakiShipMain/Customer/TrackPackagePage";
import { EditProfilePage } from "./PakiShip/PakiShipMain/Customer/EditProfilePage";
import { HistoryPage } from "./PakiShip/PakiShipMain/Customer/HistoryPage";
import { RateReviewPage } from "./PakiShip/PakiShipMain/Customer/RateReviewPage";
import { AllDeliveriesPage } from "./PakiShip/PakiShipMain/Customer/AllDeliveriesPage";

export const router = createBrowserRouter([
  // Redirect Root to PakiShip Customer Home
  {
    path: "/",
    element: <Navigate to="/customer/home" replace />
  },
  
  // ─── PakiShip Customer Routes ──────────────────────────────
  {
    path: "/customer/home",
    Component: CustomerHomePage,
  },
  {
    path: "/customer/send-parcel",
    Component: SendParcelPage,
  },
  {
    path: "/customer/track-package",
    Component: TrackPackagePage,
  },
  {
    path: "/customer/edit-profile",
    Component: EditProfilePage,
  },
  {
    path: "/customer/history",
    Component: HistoryPage,
  },
  {
    path: "/customer/rate-review",
    Component: RateReviewPage,
  },
  {
    path: "/customer/all-deliveries",
    Component: AllDeliveriesPage,
  },

  // ─── Fallback ───────────────────────────────────────────────
  {
    path: "*",
    Component: NotFound,
  },
]);
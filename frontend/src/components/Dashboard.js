import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import axios from "axios";

// Chart.js'in modüllerini aktifleştir
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/api/todos/stats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("İstatistik hatası:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="text-center p-5">Yükleniyor...</div>;

  // --- GRAFİK 1: Pasta (Tamamlanan / Bekleyen) ---
  const pieData = {
    labels: ["Tamamlanan", "Bekleyen"],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ["#198754", "#ffc107"], // Yeşil, Sarı
        hoverBackgroundColor: ["#157347", "#e0a800"],
      },
    ],
  };

  // --- GRAFİK 2: Çubuk (Kategoriler) ---
  const barData = {
    labels: ["İş", "Okul", "Kişisel", "Diğer"],
    datasets: [
      {
        label: "Görev Sayısı",
        data: [
          stats.categories.is,
          stats.categories.okul,
          stats.categories.kisisel,
          stats.categories.diger,
        ],
        backgroundColor: "rgba(53, 162, 235, 0.5)", // Mavi
      },
    ],
  };

  return (
    <div className="row mb-5">
      {/* Kart 1: Genel Özet */}
      <div className="col-md-4">
        <div className="card text-center h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Toplam Görev</h5>
            <h1 className="display-4">{stats.total}</h1>
            <p className="text-muted">
              ✅ {stats.completed} Tamamlandı <br />
              ⏳ {stats.pending} Bekliyor
            </p>
          </div>
        </div>
      </div>

      {/* Kart 2: Pasta Grafik */}
      <div className="col-md-4">
        <div className="card h-100 shadow-sm p-3">
          <h6 className="text-center mb-3">Durum Analizi</h6>
          <div style={{ height: "200px", display: "flex", justifyContent: "center" }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Kart 3: Çubuk Grafik */}
      <div className="col-md-4">
        <div className="card h-100 shadow-sm p-3">
            <h6 className="text-center mb-3">Kategori Dağılımı</h6>
            <div style={{ height: "200px" }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
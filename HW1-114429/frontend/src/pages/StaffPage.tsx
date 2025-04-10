import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserShield,
    faTicketAlt,
    faCheckCircle,
    faTimesCircle,
    faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

export function StaffPage() {
    const [token, setToken] = useState("");
    const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckIn = () => {
        if (!token.trim()) {
            setFeedback({ type: "error", message: "Por favor, insira um token válido." });
            return;
        }

        setLoading(true);
        fetch(`http://localhost:8081/api/reservations/checkin/${token}`, {
            method: "POST"
        })
            .then(res => {
                if (res.ok) {
                    setFeedback({
                        type: "success",
                        message: "Check-in registrado com sucesso!"
                    });
                } else {
                    return res.json().then(data => {
                        throw new Error(data.message || "Erro ao processar o check-in.");
                    });
                }
            })
            .catch(err => {
                setFeedback({
                    type: "error",
                    message: err.message || "Token inválido ou check-in já realizado."
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCloseFeedback = () => {
        setFeedback(null);
        if (feedback?.type === "success") {
            setToken("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            <FontAwesomeIcon icon={faUserShield} className="mr-2 text-indigo-600" />
                            Área de Staff
                        </h1>
                        <button
                            onClick={() => navigate("/restaurants")}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                            Voltar
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <div className="text-center">
                        <h2 className="text-lg font-medium text-gray-900 mb-6">
                            Gestão de Check-ins
                        </h2>

                        <div className="mt-4">
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                                Token da Reserva
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="token"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
                                    placeholder="Ex: abc123-xyz456"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleCheckIn}
                                disabled={loading}
                                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </>
                                ) : (
                                    "Confirmar Check-in"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Feedback Modal */}
            {feedback && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${feedback.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                                    <FontAwesomeIcon
                                        icon={feedback.type === "success" ? faCheckCircle : faTimesCircle}
                                        className={`h-6 w-6 ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}
                                    />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {feedback.type === "success" ? "Sucesso!" : "Erro"}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {feedback.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 ${feedback.type === "success" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-red-600 hover:bg-red-700"} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${feedback.type === "success" ? "focus:ring-indigo-500" : "focus:ring-red-500"} sm:text-sm`}
                                    onClick={handleCloseFeedback}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
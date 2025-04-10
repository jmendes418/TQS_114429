import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faUtensils,
    faTicketAlt,
    faCheckCircle,
    faTimes,
    faTrashAlt,
    faArrowLeft,
    faInfoCircle,
    faClock,
    faBan
} from "@fortawesome/free-solid-svg-icons";

interface Reservation {
    token: string;
    restaurantName: string;
    date: string;
    checkedIn: boolean;
    cancelled: boolean;
    type: "ALMOCO" | "JANTAR";
}

export function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelMessage, setCancelMessage] = useState("");
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmCancel, setConfirmCancel] = useState<{token: string, show: boolean}>({token: "", show: false});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            const stored = localStorage.getItem("reservationTokens");
            if (!stored) {
                setLoading(false);
                return;
            }

            const tokens: string[] = JSON.parse(stored);

            try {
                const results = await Promise.allSettled(
                    tokens.map(token =>
                        fetch(`http://localhost:8081/api/reservations/${token}`)
                            .then(res => {
                                if (!res.ok) throw new Error("Token inválido");
                                return res.json();
                            })
                    )
                );

                const validReservations: Reservation[] = [];
                const validTokens: string[] = [];

                results.forEach((r, i) => {
                    if (r.status === "fulfilled") {
                        validReservations.push(r.value);
                        validTokens.push(tokens[i]);
                    }
                });

                setReservations(validReservations);
                localStorage.setItem("reservationTokens", JSON.stringify(validTokens));
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleCancel = async (token: string) => {
        setLoading(true);
        try {
            await fetch(`http://localhost:8081/api/reservations/${token}`, {
                method: "DELETE",
            });

            setReservations(prev => prev.filter(r => r.token !== token));
            setCancelMessage("Reserva cancelada com sucesso.");
            setShowCancelModal(true);

            const stored = localStorage.getItem("reservationTokens");
            const tokens: string[] = stored ? JSON.parse(stored) : [];
            const updated = tokens.filter(t => t !== token);
            localStorage.setItem("reservationTokens", JSON.stringify(updated));
        } catch (err) {
            console.error("Erro ao cancelar reserva:", err);
            setCancelMessage("Erro ao cancelar reserva. Por favor, tente novamente.");
            setShowCancelModal(true);
        } finally {
            setLoading(false);
            setConfirmCancel({token: "", show: false});
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    };

    const getStatusBadge = (reservation: Reservation) => {
        if (reservation.cancelled) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FontAwesomeIcon icon={faBan} className="mr-1" />
          Cancelada
        </span>
            );
        }
        if (reservation.checkedIn) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
          Utilizada
        </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <FontAwesomeIcon icon={faClock} className="mr-1" />
        Ativa
      </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-indigo-600" />
                            Minhas Reservas
                        </h1>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate("/restaurants")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                Voltar
                            </button>
                            <button
                                onClick={() => navigate("/staff")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Ir para Staff
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            <FontAwesomeIcon icon={faInfoCircle} className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma reserva encontrada</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Você ainda não fez nenhuma reserva ou suas reservas expiraram.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate("/restaurants")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Fazer uma reserva
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantina
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Token
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {reservations.map((reservation, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-400" />
                                            {formatDate(reservation.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faUtensils} className="mr-2 text-gray-400" />
                                            {reservation.restaurantName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.type === "ALMOCO" ? "Almoço" : "Jantar"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(reservation)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => setSelectedToken(reservation.token)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Ver Token
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {!reservation.cancelled && !reservation.checkedIn && (
                                                <button
                                                    onClick={() => setConfirmCancel({token: reservation.token, show: true})}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                                    Cancelar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Token Modal */}
            {selectedToken && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                    <FontAwesomeIcon icon={faTicketAlt} className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Token da Reserva
                                    </h3>
                                    <div className="mt-4">
                                        <div className="px-4 py-3 bg-gray-50 rounded-md overflow-x-auto">
                                            <code className="font-mono text-sm break-all">{selectedToken}</code>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Este token será necessário para acessar sua reserva.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => setSelectedToken(null)}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {confirmCancel.show && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <FontAwesomeIcon icon={faTimes} className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Confirmar cancelamento
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => setConfirmCancel({token: "", show: false})}
                                    disabled={loading}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                    onClick={() => handleCancel(confirmCancel.token)}
                                    disabled={loading}
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
                                        "Confirmar Cancelamento"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Feedback Modal */}
            {showCancelModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {cancelMessage.includes("sucesso") ? "Sucesso!" : "Atenção"}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {cancelMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => setShowCancelModal(false)}
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
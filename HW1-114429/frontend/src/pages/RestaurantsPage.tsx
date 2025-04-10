import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUtensils,
    faCalendarAlt,
    faMapMarkerAlt,
    faSearch,
    faThermometerHalf,
    faThermometerQuarter,
    faCloudRain,
    faPlus,
    faCheckCircle,
    faExclamationTriangle,
    faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

interface Restaurant {
    id: number;
    name: string;
    location: string;
}

interface Weather {
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
}

interface Meal {
    date: string;
    description: string;
    type: "ALMOCO" | "JANTAR";
    forecast: Weather;
}

interface GroupedMeal {
    date: string;
    almoco?: Meal;
    jantar?: Meal;
}

interface Reservation {
    token: string;
    restaurantName: string;
    date: string;
    checkedIn: boolean;
    cancelled: boolean;
    type: "ALMOCO" | "JANTAR";
}

export function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [groupedMeals, setGroupedMeals] = useState<GroupedMeal[]>([]);
    const [selectedForecast, setSelectedForecast] = useState<Weather | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showReservationOptions, setShowReservationOptions] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [reservationToken, setReservationToken] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8081/api/restaurants")
            .then((res) => res.json())
            .then((data) => {
                setRestaurants(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching restaurants:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedRestaurant) {
            setLoading(true);
            fetch(`http://localhost:8081/api/meals?restaurantId=${selectedRestaurant.id}`)
                .then((res) => res.json())
                .then((data: Meal[]) => {
                    const grouped: Record<string, GroupedMeal> = {};

                    data.forEach((meal) => {
                        if (!grouped[meal.date]) {
                            grouped[meal.date] = { date: meal.date };
                        }
                        if (meal.type === "ALMOCO") grouped[meal.date].almoco = meal;
                        if (meal.type === "JANTAR") grouped[meal.date].jantar = meal;
                    });

                    setGroupedMeals(Object.values(grouped));
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching meals:", err);
                    setLoading(false);
                });
        }
    }, [selectedRestaurant]);

    const handleReservation = (type: "ALMOCO" | "JANTAR") => {
        if (!selectedRestaurant || !selectedDate) return;

        setLoading(true);
        const stored = localStorage.getItem("reservationTokens");
        const tokens: string[] = stored ? JSON.parse(stored) : [];

        Promise.allSettled(tokens.map(token =>
            fetch(`http://localhost:8081/api/reservations/${token}`)
                .then(res => {
                    if (!res.ok) throw new Error("Invalid token");
                    return res.json();
                })
        )).then(results => {
            const reservations = results
                .filter(r => r.status === "fulfilled")
                .map(r => (r as PromiseFulfilledResult<Reservation>).value);

            const conflict = reservations.find(r =>
                r.date === selectedDate &&
                r.restaurantName &&
                r.type === type &&
                !r.cancelled
            );

            if (conflict) {
                setErrorMessage(`You already have a reservation for ${type === "ALMOCO" ? "lunch" : "dinner"} on this date.`);
                setShowErrorModal(true);
                setShowReservationOptions(false);
                setLoading(false);
                return;
            }

            fetch("http://localhost:8081/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId: selectedRestaurant.id,
                    date: selectedDate,
                    type
                })
            })
                .then(res => res.json())
                .then(data => {
                    const updatedTokens = [...tokens, data.token];
                    localStorage.setItem("reservationTokens", JSON.stringify(updatedTokens));
                    setReservationToken(data.token);
                    setShowSuccessModal(true);
                    setShowReservationOptions(false);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Reservation error:", err);
                    setErrorMessage("Failed to create reservation. Please try again.");
                    setShowErrorModal(true);
                    setLoading(false);
                });
        });
    };

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        <FontAwesomeIcon icon={faUtensils} className="mr-2 text-indigo-600" />
                        Cantinas Universitárias
                    </h1>
                    <button
                        onClick={() => navigate("/reservas")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Minhas Reservas
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Search and Filter */}
                <div className="px-4 sm:px-0 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Pesquisar cantina ou localização..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Restaurant Selection */}
                <div className="px-4 sm:px-0 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Selecione a Cantina</h2>

                        {loading && !selectedRestaurant ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredRestaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.id}
                                        onClick={() => setSelectedRestaurant(restaurant)}
                                        className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                                            selectedRestaurant?.id === restaurant.id
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                        }`}
                                    >
                                        <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                            {restaurant.location}
                                        </p>
                                        {selectedRestaurant?.id === restaurant.id && (
                                            <div className="absolute top-2 right-2 h-3 w-3 bg-indigo-500 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Meals Table */}
                {selectedRestaurant && (
                    <div className="px-4 sm:px-0">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
                                        Ementas disponíveis - {selectedRestaurant.name}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedRestaurant(null)}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                        Voltar
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : groupedMeals.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Almoço
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jantar
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Meteorologia
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reservar
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {groupedMeals.map((group, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatDate(group.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {group.almoco?.description || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {group.jantar?.description || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {(group.almoco?.forecast || group.jantar?.forecast) ? (
                                                        <button
                                                            onClick={() => setSelectedForecast(group.almoco?.forecast || group.jantar?.forecast!)}
                                                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            <FontAwesomeIcon icon={faSearch} className="mr-1" />
                                                            Detalhes
                                                        </button>
                                                    ) : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDate(group.date);
                                                            setShowReservationOptions(true);
                                                        }}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                                        Reservar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Nenhuma ementa disponível para esta cantina.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Weather Modal */}
                {selectedForecast && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Previsão Meteorológica
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-2">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
                                            <span className="font-medium">{formatDate(selectedForecast.date)}</span>
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faThermometerHalf} className="mr-3 text-red-500" />
                                                <span className="text-gray-700">Temperatura Máxima: </span>
                                                <span className="ml-auto font-medium">{selectedForecast.maxTemp}°C</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faThermometerQuarter} className="mr-3 text-blue-500" />
                                                <span className="text-gray-700">Temperatura Mínima: </span>
                                                <span className="ml-auto font-medium">{selectedForecast.minTemp}°C</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faCloudRain} className="mr-3 text-blue-300" />
                                                <span className="text-gray-700">Precipitação: </span>
                                                <span className="ml-auto font-medium">{selectedForecast.precipitation} mm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setSelectedForecast(null)}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reservation Options Modal */}
                {showReservationOptions && selectedDate && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                                        Fazer Reserva
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Para {formatDate(selectedDate)} em {selectedRestaurant?.name}
                                    </p>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleReservation("ALMOCO")}
                                            disabled={loading}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                                "Reservar Almoço"
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReservation("JANTAR")}
                                            disabled={loading}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                                "Reservar Jantar"
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setShowReservationOptions(false)}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && reservationToken && (
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
                                            Reserva criada com sucesso!
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Guarde o seu token de reserva:
                                            </p>
                                            <div className="mt-2 px-4 py-3 bg-gray-50 rounded-md">
                                                <code className="font-mono font-bold text-green-600 break-all">{reservationToken}</code>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Este token será necessário para gerir a sua reserva.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setShowSuccessModal(false)}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Modal */}
                {showErrorModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Erro na reserva
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setShowErrorModal(false)}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
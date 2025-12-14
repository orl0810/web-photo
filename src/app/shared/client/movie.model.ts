export interface Movie {
	id: string;
	slug: string;
	title: string;
	genres: string[];
    popularity: string;
    budget: null | number;
	runtime: string;
	released: string;
	image: { url: string, title: string }
}

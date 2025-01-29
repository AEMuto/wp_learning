import { useSelect } from '@wordpress/data';
import { store as bookStore } from '@wordpress/core-data';
import { useBlockProps } from '@wordpress/block-editor';


export default function Edit() {
	const books = useSelect(select => select(bookStore).getEntityRecords('postType', 'book'), []);
	if (!books) return <div {...useBlockProps()}>Loading...</div>;
	return (
		<div {...useBlockProps()}>
			<ul>
				{books.map(book => (
					<li key={book.id}>
						<a href={book.link}>{book.title.rendered}</a>
					</li>
				))}
			</ul>
		</div>
	)
}

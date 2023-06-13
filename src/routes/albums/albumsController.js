const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = (req, res) => {
  db.query('SELECT * FROM albums')
    .then((results) => {
      res.status(200).send(results[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getOne = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM albums WHERE id = ?', [id])
    .then((result) => {
      if (result[0].length === 0) {
        return res.status(404).json({ error: 'Album not found' });
      }
      const album = result[0];
      return res.status(200).json(album[0]);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getTracksByAlbumId = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('SELECT * FROM track WHERE id_album = ?', [id])
    .then((results) => {
      res.status(200).json(results[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const postAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;

  db.query(
    `INSERT INTO albums (title, genre, picture, artist) VALUES (?, ?, ?, ?)`,
    [title, genre, picture, artist]
  )
    .then((result) => {
      const responseBody = {
        id: result[0].insertId,
        title,
        genre,
        picture,
        artist,
      };
      res.status(201).json(responseBody);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const updateAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  const id = parseInt(req.params.id);
  let query = 'UPDATE albums SET';

  const values = [];

  if (title) {
    query += ' title = ?,';
    values.push(title);
  }
  if (genre) {
    query += ' genre = ?,';
    values.push(genre);
  }
  if (picture) {
    query += ' picture = ?,';
    values.push(picture);
  }
  if (artist) {
    query += ' artist = ?,';
    values.push(artist);
  }

  if (values.length === 0) {
    res.status(400).send('No fields provided');
    return;
  }

  query = query.slice(0, -1);
  query += ' WHERE id = ?';
  values.push(id);

  db.query(query, values)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const deleteAlbums = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM albums WHERE id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};

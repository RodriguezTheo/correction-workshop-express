const connexion = require('../../../db-config');
const db = connexion.promise();

const getOne = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM track WHERE id = ?', [id])
    .then((result) => {
      if (result[0].length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
      const album = result[0];
      return res.status(200).json(album[0]);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getAll = (req, res) => {
  db.query(`SELECT * FROM track`)
    .then((results) => {
      res.status(200).json(results[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const postTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;

  db.query(
    `INSERT INTO track (title, youtube_url, id_album) VALUES (?, ?, ?)`,
    [title, youtube_url, parseInt(id_album)]
  )
    .then((result) => {
      const responseBody = {
        id: result[0].insertId,
        title,
        youtube_url,
        id_album,
      };
      res.status(201).json(responseBody);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const updateTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;
  const id = parseInt(req.params.id);
  let query = 'UPDATE track SET';

  const values = [];

  if (title) {
    query += ' title = ?,';
    values.push(title);
  }
  if (youtube_url) {
    query += ' youtube_url = ?,';
    values.push(youtube_url);
  }
  if (id_album) {
    query += ' id_album = ?,';
    values.push(parseInt(id_album));
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

const deleteTracks = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM track WHERE id = ?', [id])
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

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };

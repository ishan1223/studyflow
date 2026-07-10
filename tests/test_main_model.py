from src.main import compute_similarity_score


def test_compute_similarity_score_falls_back_without_model():
    score = compute_similarity_score("The capital of France", "Paris")
    assert 0.0 <= score <= 1.0
    assert score > 0.0

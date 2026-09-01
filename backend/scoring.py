class ScoringEngine:
    @staticmethod
    def calculate_level_score(correct_count, total_count=10, cutoff=70):
        pct = (correct_count / total_count) * 100
        return {
            'score': correct_count,
            'total': total_count,
            'percentage': round(pct, 1),
            'status': 'PASSED' if pct >= cutoff else 'FAILED'
        }

    @staticmethod
    def calculate_composite_score(aptitude_pct, technical_pct, hr_pct):
        composite = (aptitude_pct * 0.4) + (technical_pct * 0.35) + (hr_pct * 0.25)
        return round(composite, 1)
